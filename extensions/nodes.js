/**
 * Coded with love by Failfa.st
 * LICENSE: AGPL 3.0
 * https://github.com/failfa-st/failfast-comfyui-extensions/blob/main/LICENSE
 *
 * Visit https://github.com/failfa-st/failfast-comfyui-extensions for more info
 *
 * Hopmepage:  https://failfa.st
 * GitHub: https://github.com/failfa-st
 * Discord: https://discord.com/invite/m3TBB9XEkb
 */
import { app } from "../../../scripts/app.js";

/**
 * Nodes
 */

const nodesName = "Failfast.nodes";

const store = {
  stack: new Set(),
};

app.registerExtension({
  name: nodesName,
  async init(app) {
    app.ui.settings.addSetting({
      id: nodesName,
      name: "Allow group selection resize",
      type: "boolean",
      tooltip: "Resize all selected nodes synchronous.",
      defaultValue: false,
    });
  },
  async setup(app) {
    console.log(app);
    app.graph._nodes.forEach((node) => {
      let active = JSON.parse(
        window.localStorage.getItem(`Comfy.Settings.${nodesName}`) ?? "false",
      );
      const onResize = node.onResize;
      node.onResize = function (size) {
        console.log(active);
        if (active) {
          Array.from(store.stack)
            .filter((node_) => node_ !== node)
            .forEach((node_) => {
              node_.size[0] = size[0];
              node_.size[1] = size[1];
            });
        }
        return onResize?.apply(this, arguments);
      };
      const onMouseDown = node.onMouseDown;
      node.onMouseDown = function () {
        active = JSON.parse(
          window.localStorage.getItem(`Comfy.Settings.${nodesName}`) ?? "false",
        );
        return onMouseDown?.apply(this, arguments);
      };
      const onSelected = node.onSelected;
      node.onSelected = function () {
        store.stack.add(node);
        return onSelected?.apply(this, arguments);
      };
      const onDeselected = node.onDeselected;
      node.onDeselected = function () {
        store.stack.delete(node);
        return onDeselected?.apply(this, arguments);
      };
    });
  },
});
