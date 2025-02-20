/* global joint editModel */
const joint = window.joint;
import { editModel } from '../tools/EditButton.js';
import { legend } from './Legend.js';
import { color } from '../colors.js';
export function saveEdits() {
    console.log('saving edits...');
    let texts = $('[name^="model-text-"]').toArray();
    console.log($('[name^="model-validity-"]').toArray());
    let validities = $('[name^="model-validity-"]').toArray().map((element) => +(Math.min(Math.max(0, parseFloat(element.value)), 1).toFixed(1)));
    console.log('validities', validities);
    let text_wraps = texts.map((element) => joint.util.breakText(element.value, { width: 190 }));
    let num_lines = text_wraps.map(wrap => (wrap.match(/\n/g) || []).length);
    //magic numbers have to do with font size... ask Joe
    let heights = num_lines.map(lines => 16 + 13 * lines);
    console.log(heights);
    if (editModel.isLink()) {
        console.log("saving link edits");
        let link_color = "#bbbbbb";
        const objectionSwitch = document.getElementById("objection-switch");
        link_color = objectionSwitch.checked ? color.link.dark.objection.stroke : color.link.dark.claim.stroke;
        let weight = Math.min(Math.max(0, $('#link-weight-rect').val()), 1).toFixed(1);
        let oldLabel = editModel.attributes.labels[0];
        editModel.label(0, {
            attrs: {
                text: {
                    class: oldLabel.attrs.text.class,
                    text: weight,
                    stroke: link_color
                },
                rect: {
                    class: oldLabel.attrs.rect.class,
                    fill: oldLabel.attrs.rect.fill
                }
            }
        });
        editModel.attr("line/stroke", link_color);
        console.log(weight);
    }
    else if (editModel.attributes.type === "dependent-premise") {
        console.log("saving dependent premise");
        //save new text and adjust size on each model in dependent premise
        editModel.getEmbeddedCells().forEach((cell, index) => {
            console.log(cell);
            console.log(text_wraps[index]);
            cell.attr('text/text', text_wraps[index]);
            //cell.attributes.size.height = heights[index];
            console.log(cell.attributes.attrs.text.text);
            console.log('height: ', heights[index]);
            cell.resize(cell.attributes.size.width, heights[index]);
        });
        let max_height = 13 + Math.max(...heights);
        //the 36 is dependent on font-size!!
        let width = 36 + editModel.getEmbeddedCells().reduce((total, cell) => total + cell.attributes.size.width, 0);
        // let combinedText = text_wraps.slice(1).reduce((total:string, current:string) => {
        //   return combineText(total, current);
        // }, text_wraps[0]);
        //editModel.attr('text/text', combinedText)
        editModel.resize(width, max_height);
        // console.log((height/16) - 1)
        //console.log("new_text", editModel.attributes.attrs.text.text)
    }
    else if (editModel.attributes.type === "claim") {
        //just update the single model with the new text and size
        editModel.attr('text/text', text_wraps[0]);
        //console.log(validities)
        editModel.attributes.validity = validities[0];
        editModel.attributes.storedInfo.initialText = text_wraps[0];
        editModel.resize(editModel.attributes.size.width, heights[0]);
        //editModel.attr("rect/fill", createColor(editModel.attributes.validity, editModel.attributes.type))
        //editModel.attr("rect/strokeWidth", getStrokeWidth(editModel.attributes.validity))
        // const objectionSwitch = document.getElementById("objection-switch") as HTMLInputElement;
        // if(editModel.attributes.type === "claim" && objectionSwitch.checked) {
        //   ClaimToObjection(editModel)
        // }
        // else if(editModel.attributes.type === "objection" && !objectionSwitch.checked) {
        //   ObjectionToClaim(editModel)
        // }
        console.log(editModel);
    }
    else if (editModel.attributes.type === "source") {
    }
    const saveButton = document.getElementById("save-edit-button");
    saveButton === null || saveButton === void 0 ? void 0 : saveButton.classList.remove("changed");
    // const editContainer = $('#edit-container');
    // editContainer.hide(200);
    $('#edit-dialog').dialog('close');
    legend.refresh();
}
export function discardEdits() {
    const editContainer = $('#edit-container');
    editContainer.hide(200);
}
