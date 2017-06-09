## Requirements

[ffmpeg](https://www.ffmpeg.org/download.html) is needed to prepare media files for ABR streaming, including `ffprobe` command line tool to display information about media streams.
[bento4](https://www.bento4.com/downloads/) is also required to structure media bitstreams as expected. 
## Prepare your media files

As an example, I'll use the film [Elephants Dream](https://orange.blender.org/), which is under Creative Commons license, and more specifically its [mp4 version](http://ia600209.us.archive.org/20/items/ElephantsDream/ed_hd.mp4).

### Video streams
The video track of `ed_hd.mp4` is gonna be my mezzanine media file, let's have a look at the bitstream structure using `ffprobe` :

```
ffprobe -show_frames -select_streams v:0 -print_format csv=print_section=0:item_sep=; -show_entries frame=key_frame,pkt_pts_time,coded_picture_number ed_hd.mp4 > ed_hd.csv
```

First, terminal output shows some useful information, more precisely :

```
 Duration: 00:10:53.85, start: 0.000000, bitrate: 829 kb/s
    Stream #0:0(und): Video: h264 (Constrained Baseline) (avc1 / 0x31637661), yuv420p, 640x360, 696 kb/s, 24 fps, 24 tbr, 12288 tbn, 48 tbc (default)
```

Movie lasts `10:53.85` in total, hence `653.85s` , video stream is encoded using h264 constrained baseline with an avg bitrate of `696kbps`, a resolution of `640x360` and a framerate of `24fps`. Now let's have a look at `ed_hd.csv`, which contains per frame information. First column indicates if the frame is a key frame, second is the packet presentation timestamp, aka. PTS, and last shows the coded picture counter. The file contains `15691` lines, one per frame, as we can expect `(15691+1)/24 = 653.83` (number of frames + 1 / framerate = stream duration). There are `147` key frames, meaning one every `4.45s` roughly. Maximum time range between two consecutives key frame is `10.416667s`, we can conclude that max gop size was set to 250 (`10.416667 * 24fps`), which is way too much for our purpose. So, we must re-encode our mezzianine video file to serve us better, with a fix gop size of `2s`. This is what's broadly used in the industry, as a good trade-off between coding efficiency and the ability to quickly react depending on network condition changes. We use a two pass encoding as following:

```
ffmpeg -y -i ed_hd.mp4 -c:v libx264 -x264-params keyint=48:min-keyint=48:scenecut=-1:nal-hrd=cbr -b:v 600k -bufsize 1200k -maxrate 600k -profile:v high -level 4.2 -pass 1 -c:a copy -f mp4 NUL && ffmpeg -i ed_hd.mp4 -c:v libx264 -x264-params keyint=48:min-keyint=48:scenecut=-1:nal-hrd=cbr -b:v 600k -bufsize 1200k -maxrate 600k -profile:v high -level 4.2 -pass 2 -c:a copy ed_hd_640x480.mp4
```

We specify a gop size of `48` frames (every `2s`) with `keyint=48:min-keyint=48`, no scene cut detection (to avoid unexpected key frames) and constant bitrate mode targetting `600kbps`. As you can see, the target bitrate is slightly lower than for the mezzianine file, this is because we use h264 high profile which provides a much better compression rate than constrained baseline, even if we drastically reduce the gop size it should not impact video quality. We also specify that our HRD model has a max size of twice the bitrate, meaning that each fragment of `2s` cannot exceed the target bitrate.

For this experiment, we'll also generate two additionnal low-resolution video streams of `480x270` and `320x180` respectively, with corresponding bitrates of `400kbps` and `200kbps` (chose arbitrarily for this example):

```
ffmpeg -y -i ed_hd.mp4 -vf scale=w=480:h=270 -c:v libx264 -x264-params keyint=48:min-keyint=48:scenecut=-1:nal-hrd=cbr -b:v 400k -bufsize 800k -maxrate 400k -profile:v high -level 4.2 -pass 1 -an -f mp4 NUL && ffmpeg -i ed_hd.mp4 -vf scale=w=480:h=270 -c:v libx264 -x264-params keyint=48:min-keyint=48:scenecut=-1:nal-hrd=cbr -b:v 400k -bufsize 800k -maxrate 400k -profile:v high -level 4.2 -pass 2 -an -movflags frag_keyframe ed_hd_480x270.mp4
```

```
ffmpeg -y -i ed_hd.mp4 -vf scale=w=320:h=180 -c:v libx264 -x264-params keyint=48:min-keyint=48:scenecut=-1:nal-hrd=cbr -b:v 200k -bufsize 400k -maxrate 200k -profile:v high -level 4.2 -pass 1 -an -f mp4 NUL && ffmpeg -i ed_hd.mp4 -vf scale=w=320:h=180 -c:v libx264 -x264-params keyint=48:min-keyint=48:scenecut=-1:nal-hrd=cbr -b:v 200k -bufsize 400k -maxrate 200k -profile:v high -level 4.2 -pass 2 -an -movflags frag_keyframe ed_hd_320x180.mp4
```

Note that this time the audio track is not needed, since it's already available in `ed_hd_640x480.mp4`. We just drop it by using the `-an` option.

Now that we have transcoded our video streams with the expected format, it's possible to generate the fragmented version of our mp4 files with the commands :

```
mp4fragment ed_hd_320x180.mp4 ed_hd_320x180_fragments.mp4
mp4fragment ed_hd_480x270.mp4 ed_hd_480x270_fragments.mp4
mp4fragment ed_hd_640x360.mp4 ed_hd_640x360_fragments.mp4
```

### Audio streams

The file `ed_hd_640x360_fragments.mp4` we generated above contains the original audio track aleady. To simulate audio multitracking, we'll add an additionnal audio track which is going to a degraded version of the original. Not really usefull but it has the merit of showing how to deal with multiple audiotracks. Again, looking back at `ffprobe` command output, the original audio track is described as follow :

```
Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 44100 Hz, stereo, fltp, 128 kb/s (default)
```

To obtain a stream at a lower bitrate (let say 24kbps), we'll use `ffmpeg` with parameters :

```
ffmpeg -i ed_hd.mp4 -vn -b:a 24k -c:a aac ed_hd_audio_24k.mp4
```

If you listen to `ed_hd_audio_24k.mp4` using your favorite player, you'll ear indeed how crappy it sounds. This low quality audio file can now be fragmented as required by ABR streaming using :

```
mp4fragment --fragment-duration 2000 ed_hd_audio_24k.mp4 ed_hd_audio_24k_fragments.mp4
```

As for video tracks, we want fragments of `2s` as specified by `--fragment-duration 2000`.

### Subtitles

### Generate DASH/HLS compatible streams



## Other examples

[Bitmovin](https://bitmovin.com/mpeg-dash-hls-examples-sample-streams/) provides a bunch of samples for DASH and HLS.
[Akamai](http://players.akamai.com) also proposes several DASH and HLS streams.