
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: 'test.csv',
  header: [
    {id: 'name', title: 'NAME'},
    {id: 'age', title: 'AGE'}
  ]
})

const records = [
  {name: 'Bob', age: 30},
  {name: 'John', age: 40},
]


  setInterval(function (records) {
    console.log('doin something');
    csvWriter.writeRecords(records)
      .then(() =>{
      console.log('done');
      })
  }, 1000, records)