export default {
    getTreeViewFromObject(object) {
        return Object.keys(object).map(
            (k) => {
                if (object[k] instanceof Array || object[k] instanceof Object) {
                    return {
                        text: k,
                        nodes: this.getTreeViewFromObject(object[k])
                    }
                } else {
                    return {
                        text: `${k}: ${object[k]}`
                    }
                }
            }
        )
    }
}
