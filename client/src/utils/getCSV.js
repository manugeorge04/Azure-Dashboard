import {Parser} from 'json2csv'
import {format} from 'date-fns'

const getCSV = (report, showDetails) => {       

    let fields = [{
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
        label: 'usageStartTime',
        value: (row, field) => format(new Date(row[field.label].slice(0,10)), 'dd-MMM-yyyy')
      },{
        label: 'usageEndTime',
        value: (row, field) => format(new Date(row[field.label].slice(0,10)), 'dd-MMM-yyyy')
      }];

    if (showDetails) {
      const additionalField = [
        {
          label: 'Resource URI',
          value: 'instanceData.resourceUri'
        },{        
          label: 'Location',
          value: 'instanceData.location'
        }
      ]
      fields = fields.concat(additionalField)
    } 

    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(report)

    return csv
}

export default getCSV