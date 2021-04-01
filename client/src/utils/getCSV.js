import {Parser} from 'json2csv'

const getCSV = (report, showDetails) => {
    
    const fields = [{
        label: 'Resource_id',
        value: 'resource.id'
      },{
        label: 'Name',
        value: 'resource.name'
      },{
        label: 'Region',
        value: 'resource.region'
      },{
        label: 'Sub-Category',
        value: 'resource.subcategory'
      },{
        label: 'Quantity',
        value: 'quantity'
      },{
        label: 'Unit',
        value: 'unit'
      },{
        label: 'Usage Start Time',
        value: 'usageStartTime'
      },{
        label: 'Usage End Time',
        value: 'usageEndTime'
      }];

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(report)

    return csv
}

export default getCSV