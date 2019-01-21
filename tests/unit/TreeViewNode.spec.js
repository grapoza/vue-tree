import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';

const localVue = createLocalVue();

const getDefaultPropsData = function () {
    let radioState = {};
    return {
        model: generateNodes(['ces'], radioState)[0],
        depth: 0,
        treeId: 'tree-id',
        radioGroupValues: radioState
    }
};

function createWrapper(customPropsData, customAttrs) {
    return shallowMount(TreeViewNode, {
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
                radioGroupValues: {}
            });
        });

        it('normalizes model data on the original object', () => {
            expect(model.id).to.equal('my-node');
            expect(model.label).to.equal('My Node');
            expect(model.expandable).to.be.true;
            expect(model.selectable).to.be.false;
            expect(model.state).to.exist;
            expect(model.state.expanded).to.be.false;
            expect(model.state.selected).to.be.false;
            expect(model.input).to.be.null;
            expect(model.state.input).to.not.exist;
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
                depth: 0,
                radioGroupValues: radioState
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
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState
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
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState
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

    describe('when a node\'s model is disabled', () => {

        beforeEach(() => {
            let radioState = {};
            let model = generateNodes(['ces!'], radioState)[0];

            console.debug(model);

            wrapper = createWrapper({
                model,
                depth: 0,
                treeId: 'tree',
                radioGroupValues: radioState
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
});
