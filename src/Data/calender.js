

export const frequency = (id,regular) => [
    {
      id: 1,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-01-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 2,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-02-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 2,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-03-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 3,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-04-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 4,
      payment: 14-id,
      date: "2019-05-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 5,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-06-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 6,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-07-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:false
    },
    {
      id: 7,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-08-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 8,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-09-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 9,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-10-01",
      status: "paid",
      amount: 445,
      type: "monthly",
      category: "bills",
      ontime:true
    },
    {
      id: 10,
      payment: regular ? 15 - id  : Math.floor(Math.random() * 20) + 1-id,
      date: "2019-11-01",
      status: "paid",
      amount: 405,
      type: "monthly",
      category: "bills",
      ontime:true
    }
]

export const dataSet = [{
    id: 1,
    name: "TV bill",
    frequency:frequency(1,true),
    isregular:true
  },
  {
    id: 3,
    name: "Internet bill",
    frequency:frequency(3,true),
    isregular:true
    
  },
  {
    id: 4,
    name: "House rent",
    frequency:frequency(5,true),
    isregular:true
  },
  {
    id: 6,
    name: "Travel",
    frequency:frequency(4,false),
    isregular:false
  },
  {
    id: 6,
    name: "Restaurant",
    frequency:frequency(5,false),
    isregular:false
  }
  ];