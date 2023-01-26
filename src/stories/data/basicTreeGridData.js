export default [
  {
    id: 'basic-node1',
    description: 'Thingies',
    price: '$1.25',
    children: [],
  },
  {
    id: 'basic-node2',
    description: 'Widgets',
    price: '',
    children: [
      {
        id: 'basic-node3',
        description: 'Hyper Widgets',
        price: '$130.99',
        children: [],
      },
      {
        id: 'basic-node4',
        description: 'Passive Widgets',
        price: '',
        children: [
          {
            id: 'basic-node5',
            description: 'Turtle Widgets',
            price: '$0.99',
            children: [],
          },
          {
            id: 'basic-node6',
            description: 'Sloth Widgets',
            price: '$0.89',
            children: [],
          }
        ],
      }
    ],
  },
];