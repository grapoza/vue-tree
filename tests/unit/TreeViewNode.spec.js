import { expect } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import TreeViewNode from '../../src/components/TreeViewNode.vue';
import { generateNodes } from '../data/node-generator.js';

const localVue = createLocalVue();

const defaultPropsData = {
    model: generateNodes(['ces'])[0],
    depth: 0,
    treeId: 'tree-id'
};

function createWrapper(customPropsData, customAttrs) {
    return shallowMount(TreeViewNode, {
        propsData: customPropsData || defaultPropsData,
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
                model
            });
        });

        it('normalizes model data on the original object', () => {
            expect(model.id).to.equal('my-node');
            expect(model.label).to.equal('My Node');
            expect(model.checkable).to.be.false;
            expect(model.expandable).to.be.true;
            expect(model.selectable).to.be.false;
            expect(model.state).to.exist;
            expect(model.state.checked).to.be.false;
            expect(model.state.expanded).to.be.false;
            expect(model.state.selected).to.be.false;
        });
    });

    describe('when passed a tree ID', () => {

        beforeEach(() => {
            wrapper = createWrapper();
        });

        it('has a nodeId made of the tree ID and model ID', () => {
            expect(wrapper.vm.nodeId).to.equal(wrapper.vm.treeId + '-' + wrapper.vm.model.id);
        });

        it('has a checkboxId made of the node ID and -cbx', () => {
            expect(wrapper.vm.checkboxId).to.equal(wrapper.vm.nodeId + '-cbx');
        });

        it('has an expanderId made of the node ID and -exp', () => {
            expect(wrapper.vm.expanderId).to.equal(wrapper.vm.nodeId + '-exp');
        });
    });

    describe('when not passed a tree ID', () => {

        beforeEach(() => {
            wrapper = createWrapper({
                model: generateNodes(['ces'])[0],
                depth: 0
            });
        });

        it('has a null nodeId', () => {
            expect(wrapper.vm.nodeId).to.be.null;
        });

        it('has a null checkboxId', () => {
            expect(wrapper.vm.checkboxId).to.be.null;
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

    describe('when the node\'s checkbox is toggled', () => {

        let checkbox = null;

        beforeEach(() => {
            wrapper = createWrapper();
            checkbox = wrapper.find('#' + wrapper.vm.checkboxId);
        });

        it('should toggle the checked state', () => {
            checkbox.trigger('click');
            expect(wrapper.vm.model.state.checked).to.be.true;
        });

        it('should emit the treeViewNodeCheckedChange event', () => {
            checkbox.trigger('click');
            expect(wrapper.emitted().treeViewNodeCheckedChange.length).to.equal(1);
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

    describe('when the node\'s expander is toggled', () => {

        let expander = null;

        beforeEach(() => {
            wrapper = createWrapper({
                model: generateNodes(['ces', ['ces']])[0],
                depth: 0,
                treeId: 'tree'
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
});
