import { expect } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';

const localVue = createLocalVue();

const getDefaultPropsData = function () {
    let radioState = {};
    return {
        model: generateNodes(['ces'], radioState)[0],
        modelDefaults: {},
        depth: 0,
        treeId: 'tree-id',
        radioGroupValues: radioState,
        customizations: {}
    }
};

function createWrapper(customPropsData, customAttrs) {
    return mount(TreeViewNode, {
        propsData: customPropsData || getDefaultPropsData(),
        localVue,
        attrs: customAttrs
    });
}

describe('TreeViewNode.vue', () => {

    let wrapper = null;

    afterEach(() => {
        wrapper.vm.$destroy();
        wrapper = null;
    });

    describe('when given minimal model data', () => {

        let model;

        beforeEach(() => {
            model = { id: 'my-node', label: 'My Node' };

            wrapper = createWrapper({
                depth: 0,
                model,
                modelDefaults: {},
                radioGroupValues: {},
                customizations: {}
            });
        });

        it('normalizes model data on the original object', () => {
            expect(model.id).to.equal('my-node');
            expect(model.label).to.equal('My Node');
            expect(model.title).to.be.null;
            expect(model.expandable).to.be.true;
            expect(model.selectable).to.be.false;
            expect(model.deletable).to.be.false;
            expect(model.state).to.exist;
            expect(model.state.expanded).to.be.false;
            expect(model.state.selected).to.be.false;
            expect(model.input).to.be.null;
            expect(model.state.input).to.not.exist;
        });
    });

    describe('when given default model data', () => {

        let model;

        beforeEach(() => {
            model = { id: 'my-node', label: 'My Node', expandable: true };

            wrapper = createWrapper({
                depth: 0,
                model,
                modelDefaults: {
                    expandable: false,
                    selectable: true,
                    state: {
                        selected: true
                    }
                },
                radioGroupValues: {},
                customizations: {}
            });
        });

        it('should incorporate the default data into the model for unspecified properties', () => {
            expect(model.selectable).to.be.true;
            expect(model.state.selected).to.be.true;
        });

        it('should use the model\'s data over the default data for specified properties', () => {
            expect(model.expandable).to.be.true;
        });
    });

    describe('when given a title in the model data for a text node', () => {

        beforeEach(() => {
            wrapper = createWrapper({
                depth: 0,
                model: { id: 'my-node', label: 'My Node', title: 'My Title' },
                modelDefaults: {},
                radioGroupValues: {},
                customizations: {}
            });
        });

        it('should have a title attribute on the node\'s text', () => {
            let elem = wrapper.find(`.tree-view-node-self-text`).element;
            expect(elem.getAttribute("title")).to.equal("My Title");
        });
    });

    describe('when given a title in the model data for an input node', () => {

        beforeEach(() => {
            let data = getDefaultPropsData();
            data.model.title = "My Title";

            wrapper = createWrapper(data);
        });

        it('should have a title attribute on the node\'s label', () => {
            let elem = wrapper.find(`.tree-view-node-self-label`).element;
            expect(elem.getAttribute("title")).to.equal("My Title");
        });
    });

    describe('when passed a tree ID', () => {

        beforeEach(() => {
            wrapper = createWrapper();
        });

        it('has a nodeId made of the tree ID and model ID', () => {
            expect(wrapper.vm.nodeId).to.equal(wrapper.vm.treeId + '-' + wrapper.vm.model.id);
        });

        it('has an expanderId made of the node ID and -exp', () => {
            expect(wrapper.vm.expanderId).to.equal(wrapper.vm.nodeId + '-exp');
        });

        describe('and the node has an input', () => {

            it('has an inputId made of the node ID and -input', () => {
                expect(wrapper.vm.inputId).to.equal(wrapper.vm.nodeId + '-input');
            });
        });
    });

    describe('when not passed a tree ID', () => {

        beforeEach(() => {
            let radioState = {};
            wrapper = createWrapper({
                model: generateNodes(['ces'], radioState)[0],
                modelDefaults: {},
                depth: 0,
                radioGroupValues: radioState,
                customizations: {}
            });
        });

        it('has a null nodeId', () => {
            expect(wrapper.vm.nodeId).to.be.null;
        });

        it('has a null inputId', () => {
            expect(wrapper.vm.inputId).to.be.null;
        });

        it('has a null expanderId', () => {
            expect(wrapper.vm.expanderId).to.be.null;
        });
    });

    describe('when the node\'s body is clicked', () => {

        let nodeBody = null;

        beforeEach(() => {
            wrapper = createWrapper();
            nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .tree-view-node-self`);
        });

        it('should emit the treeViewNodeClick event', () => {
            nodeBody.trigger('click');
            expect(wrapper.emitted().treeViewNodeClick.length).to.equal(1);
        });
    });

    describe('when the node\'s body is double clicked', () => {

        let nodeBody = null;

        beforeEach(() => {
            wrapper = createWrapper();
            nodeBody = wrapper.find(`#${wrapper.vm.nodeId} .tree-view-node-self`);
        });

        it('should emit the treeViewNodeDblclick event', () => {
            nodeBody.trigger('dblclick');
            expect(wrapper.emitted().treeViewNodeDblclick.length).to.equal(1);
        });
    });

    describe('when the node\'s expander is toggled', () => {

        let expander = null;

        beforeEach(() => {
            let radioState = {};
            wrapper = createWrapper({
                model: generateNodes(['ces', ['ces']], radioState)[0],
                modelDefaults: {},
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState,
                customizations: {}
            });

            expander = wrapper.find('#' + wrapper.vm.expanderId);
        });

        it('should toggle the expanded state', () => {
            expander.trigger('click');
            expect(wrapper.vm.model.state.expanded).to.be.true;
        });

        it('should emit the treeViewNodeExpandedChange event', () => {
            expander.trigger('click');
            expect(wrapper.emitted().treeViewNodeExpandedChange.length).to.equal(1);
        });

        it('should not emit the treeViewNodeClick event', () => {
            expander.trigger('click');
            expect(wrapper.emitted().treeViewNodeClick).to.be.undefined;
        });

        it('should not emit the treeViewNodeDblclick event', () => {
            expander.trigger('dblclick');
            expect(wrapper.emitted().treeViewNodeDblclick).to.be.undefined;
        });
    });

    describe('when the node\'s checkbox is toggled', () => {

        let checkbox = null;

        beforeEach(() => {
            wrapper = createWrapper();
            checkbox = wrapper.find('#' + wrapper.vm.inputId);
        });

        it('should toggle the input value state', () => {
            checkbox.trigger('click');
            expect(wrapper.vm.model.state.input.value).to.be.true;
        });

        it('should emit the treeViewNodeCheckboxChange event', () => {
            checkbox.trigger('click');
            expect(wrapper.emitted().treeViewNodeCheckboxChange.length).to.equal(1);
        });

        it('should not emit the treeViewNodeClick event', () => {
            checkbox.trigger('click');
            expect(wrapper.emitted().treeViewNodeClick).to.be.undefined;
        });

        it('should not emit the treeViewNodeDblclick event', () => {
            checkbox.trigger('dblclick');
            expect(wrapper.emitted().treeViewNodeDblclick).to.be.undefined;
        });
    });

    describe('when the node\'s radiobutton is toggled', () => {

        let radioButton = null;
        let radioState = null;

        beforeEach(() => {
            radioState = {};
            wrapper = createWrapper({
                model: generateNodes(['res'], radioState)[0],
                modelDefaults: {},
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState,
                customizations: {}
            });

            radioButton = wrapper.find('#' + wrapper.vm.inputId);
        });

        it('should toggle the input value state', () => {
            radioButton.trigger('click');
            let model = wrapper.vm.model;
            expect(wrapper.vm.radioGroupValues[model.input.name]).to.equal(model.input.value);
        });

        it('should emit the treeViewNodeRadioChange event', () => {
            radioButton.trigger('click');
            expect(wrapper.emitted().treeViewNodeRadioChange.length).to.equal(1);
        });

        it('should not emit the treeViewNodeClick event', () => {
            radioButton.trigger('click');
            expect(wrapper.emitted().treeViewNodeClick).to.be.undefined;
        });

        it('should not emit the treeViewNodeDblclick event', () => {
            radioButton.trigger('dblclick');
            expect(wrapper.emitted().treeViewNodeDblclick).to.be.undefined;
        });
    });

    describe('when a node\'s delete button is clicked', () => {

        let deleteButton = null;


        beforeEach(() => {
            let radioState = {};
            wrapper = createWrapper({
                model: generateNodes(['es', ['ds']], radioState)[0],
                modelDefaults: {},
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState,
                customizations: {}
            });

            deleteButton = wrapper.find('#' + wrapper.vm.$children[0].nodeId + '-delete');
        });

        it('should emit the treeViewNodeDelete event', () => {
            deleteButton.trigger('click');
            expect(wrapper.emitted().treeViewNodeDelete.length).to.equal(1);
        });

        it('should remove the target node from the model', () => {
            deleteButton.trigger('click');
            expect(wrapper.vm.model.children.length).to.equal(0);
        });
    });


    describe('when there is not an addChildCallback method', () => {

        let addChildButton = null;

        beforeEach(() => {
            let radioState = {};

            wrapper = createWrapper({
                model: generateNodes(['es'], radioState)[0],
                modelDefaults: {},
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState,
                customizations: {}
            });

            addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
        });

        it('should not include an add button', async () => {
            expect(addChildButton.exists()).to.be.false;
        });
    });

    describe('and there is an addChildCallback method', () => {

        let addChildButton = null;

        describe('when a node\'s add child button is clicked', () => {

            describe('and the callback resolves to node data', () => {

                beforeEach(() => {
                    let radioState = {};
                    let addChildCallback = () => {
                        return Promise.resolve({ id: 'newId', label: 'new label' });
                    };

                    wrapper = createWrapper({
                        model: generateNodes(['esa'], radioState, "", addChildCallback)[0],
                        modelDefaults: {},
                        depth: 0,
                        treeId: 'tree',
                        radioGroupValues: radioState,
                        customizations: {}
                    });

                    addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
                });

                it('should emit the treeViewNodeAdd event', async () => {
                    addChildButton.trigger('click');

                    await Promise.resolve(); // This just lets the callback resolve before the expect.

                    expect(wrapper.emitted().treeViewNodeAdd.length).to.equal(1);
                });

                it('should add a subnode to the target node from the model', async () => {
                    addChildButton.trigger('click');

                    await Promise.resolve(); // This just lets the callback resolve before the expect.

                    expect(wrapper.vm.model.children.length).to.equal(1);
                });
            });

            describe('and the callback does not resolve to node data', () => {

                beforeEach(() => {
                    let radioState = {};
                    let addChildCallback = () => {
                        return Promise.resolve(null);
                    };

                    wrapper = createWrapper({
                        model: generateNodes(['esa'], radioState, "", addChildCallback)[0],
                        modelDefaults: {},
                        depth: 0,
                        treeId: 'tree',
                        radioGroupValues: radioState,
                        customizations: {}
                    });

                    addChildButton = wrapper.find('#' + wrapper.vm.nodeId + '-add-child');
                });

                it('should not emit the treeViewNodeAdd event', async () => {
                    addChildButton.trigger('click');

                    await Promise.resolve(); // This just lets the callback resolve before the expect.

                    expect(wrapper.emitted().treeViewNodeAdd).to.be.undefined;
                });

                it('should add a subnode to the target node from the model', async () => {
                    addChildButton.trigger('click');

                    await Promise.resolve(); // This just lets the callback resolve before the expect.

                    expect(wrapper.vm.model.children.length).to.equal(0);
                });
            });
        });
    });

    describe('when a node\'s model is disabled', () => {

        beforeEach(() => {
            let radioState = {};
            let model = generateNodes(['ces!'], radioState)[0];

            wrapper = createWrapper({
                model,
                modelDefaults: {},
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState,
                customizations: {}
            });
        });

        it('has a disabled input', () => {
            let input = wrapper.find('#' + wrapper.vm.inputId);
            expect(input.element.disabled).to.be.true;
        });
    });

    describe('when a node\'s model is not disabled', () => {

        beforeEach(() => {
            wrapper = createWrapper();
        });

        it('has an enabled input', () => {
            let input = wrapper.find('#' + wrapper.vm.inputId);
            expect(input.element.disabled).to.be.false;
        });
    });


    describe('when given custom classes', () => {

        const customizations = {
            classes: {
                treeViewNode: 'customnodeclass',
                treeViewNodeSelf: 'customnodeselfclass',
                treeViewNodeSelfExpander: 'customnodeselfexpanderclass',
                treeViewNodeSelfExpanded: 'customnodeselfexpandedclass',
                treeViewNodeSelfExpandedIndicator: 'customnodeselfexpandedindicatorclass',
                treeViewNodeSelfSpacer: 'customnodeselfspacerclass',
                treeViewNodeSelfLabel: 'customnodeselflabelclass',
                treeViewNodeSelfInput: 'customnodeselfinputclass',
                treeViewNodeSelfCheckbox: 'customnodeselfcheckboxclass',
                treeViewNodeSelfRadio: 'customnodeselfradioclass',
                treeViewNodeSelfText: 'customnodeselftextclass',
                treeViewNodeSelfAction: 'customnodeselfactionclass',
                treeViewNodeSelfAddChild: 'customnodeselfaddchildclass',
                treeViewNodeSelfAddChildIcon: 'customnodeselfaddchildiconclass',
                treeViewNodeSelfDelete: 'customnodeselfdeleteclass',
                treeViewNodeSelfDeleteIcon: 'customnodeselfdeleteiconclass',
                treeViewNodeChildren: 'customnodechildrenclass'
            }
        };

        beforeEach(() => {
            let radioState = {};
            let model = generateNodes(['cEds', ['res', 'esa']], radioState, "", () => Promise.resolve())[0];

            wrapper = createWrapper({
                model,
                modelDefaults: {},
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState,
                customizations
            });
        });

        it('adds the custom class to the tree view node\'s root element', () => {
            let target = wrapper.find('.tree-view-node.' + customizations.classes.treeViewNode);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s self element', () => {
            let target = wrapper.find('.tree-view-node-self.' + customizations.classes.treeViewNodeSelf);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s expander element', () => {
            let target = wrapper.find('.tree-view-node-self-expander.' + customizations.classes.treeViewNodeSelfExpander);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s expanded element', () => {
            let target = wrapper.find('.tree-view-node-self-expanded.' + customizations.classes.treeViewNodeSelfExpanded);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s expanded indicator element', () => {
            let target = wrapper.find('.tree-view-node-self-expanded-indicator.' + customizations.classes.treeViewNodeSelfExpandedIndicator);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s spacer element', () => {
            let target = wrapper.find('.tree-view-node-self-spacer.' + customizations.classes.treeViewNodeSelfSpacer);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s label element', () => {
            let target = wrapper.find('.tree-view-node-self-label.' + customizations.classes.treeViewNodeSelfLabel);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s input element', () => {
            let target = wrapper.find('.tree-view-node-self-input.' + customizations.classes.treeViewNodeSelfInput);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s checkbox element', () => {
            let target = wrapper.find('.tree-view-node-self-checkbox.' + customizations.classes.treeViewNodeSelfCheckbox);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s radio button element', () => {
            let target = wrapper.find('.tree-view-node-self-radio.' + customizations.classes.treeViewNodeSelfRadio);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s text element', () => {
            let target = wrapper.find('.tree-view-node-self-text.' + customizations.classes.treeViewNodeSelfText);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom add child class to the tree view node\'s add child element', () => {
            let target = wrapper.find('.tree-view-node-self-action.' + customizations.classes.treeViewNodeSelfAddChild);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom action class to the tree view node\'s add child element', () => {
            let target = wrapper.find('.tree-view-node-self-action.' + customizations.classes.treeViewNodeSelfAddChild + '.' + customizations.classes.treeViewNodeSelfAction);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s add child icon element', () => {
            let target = wrapper.find('.tree-view-node-self-add-child-icon.' + customizations.classes.treeViewNodeSelfAddChildIcon);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom delete class to the tree view node\'s delete element', () => {
            let target = wrapper.find('.tree-view-node-self-action.' + customizations.classes.treeViewNodeSelfDelete);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom action class to the tree view node\'s delete element', () => {
            let target = wrapper.find('.tree-view-node-self-action.' + customizations.classes.treeViewNodeSelfDelete + '.' + customizations.classes.treeViewNodeSelfAction);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s delete icon element', () => {
            let target = wrapper.find('.tree-view-node-self-delete-icon.' + customizations.classes.treeViewNodeSelfDeleteIcon);
            expect(target.exists()).to.be.true;
        });

        it('adds the custom class to the tree view node\'s children element', () => {
            let target = wrapper.find('.tree-view-node-children.' + customizations.classes.treeViewNodeChildren);
            expect(target.exists()).to.be.true;
        });
    });
});
