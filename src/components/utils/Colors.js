'use strict';

const _colors =
    [
        "rgb(2,63,165)",
        "rgb(125,135,185)",
        "rgb(190,193,212)",
        "rgb(214,188,192)",
        "rgb(187,119,132)",
        "rgb(142,6,59)",
        "rgb(74,111,227)",
        "rgb(133,149,225)",
        "rgb(181,187,227)",
        "rgb(230,175,185)",
        "rgb(224,123,145)",
        "rgb(211,63,106)",
        "rgb(17,198,56)",
        "rgb(141,213,147)",
        "rgb(198,222,199)",
        "rgb(234,211,198)",
        "rgb(240,185,141)",
        "rgb(239,151,8)",
        "rgb(15,207,192)",
        "rgb(156,222,214)",
        "rgb(213,234,231)",
        "rgb(243,225,235)",
        "rgb(246,196,225)",
        "rgb(247,156,212)"
    ];

export default class Colors {
    static get(index) {
        if (Number.isInteger(index) && index >= 0) {
            return _colors[index % _colors.length];
        }
        console.assert(`'${index}' is an invalid color index`);
        return undefined;
    }
}