import {Parser} from 'json2csv'
import {format} from 'date-fns'

const getCSV = (report, showDetails) => {       

    let fields = [{
        label: 'Resource_id',
        value: (row, field) => { return (row.resource.id || 'N/A')}
        //value: 'resource.id'
      },{
        label: 'Name',
        value: (row, field) => { return (row.resource.name || 'N/A')}
        //value: 'resource.name'
      },{
        label: 'Category',
        value: (row, field) => { return (row.resource.subcategory || 'N/A')}
        //value: 'resource.category'
      },{
        label: 'Sub-Category',
        value: (row, field) => { return (row.resource.subcategory || 'N/A')}
        //value: 'resource.subcategory'
      },{
        label: 'Quantity',
        value: (row, field) => { return (row.quantity || 'N/A')}
        //value: 'quantity'
      },{
        label: 'Unit',
        value: (row, field) => { return (row.unit || 'N/A')}
        //value: 'unit'
      },{
        //label: 'usageStartTime',
        //value: (row, field) => format(new Date(row[field.label].slice(0,10)), 'dd-MMM-yyyy')
        //for the above format the labelname has to be the same as the object key
        label: 'Usage Start Time',
        value: 'usageStartTime'
      },{
        //label: 'usageEndTime',
        //value: (row, field) => format(new Date(row[field.label].slice(0,10)), 'dd-MMM-yyyy')
        //for the above format the labelname has to be the same as the object key
        label: 'Usage End Time',
        value: 'usageEndTime'
      },{
        label: 'Region',
        value: (row, field) => { return (row.resource.region || 'N/A')}
        //value: 'resource.region'
      }];

    if (showDetails) {
      const additionalField = [
        {        
          label: 'Location',
          value: (row, field) => {return (row.instanceData.location || 'N/A')}          
          //value: 'instanceData.location',          
        },{
          label: 'Resource Group',
          value: 'ResourceGroup'
        },{
          label: 'Resource Name',
          value: 'ResourceName'
        },{
          label: 'Resource Type',
          value: 'ResourceType'
        },{
          label: 'ResourceURI',
          value: 'instanceData.resourceUri'
        }        
      ]
      fields = fields.concat(additionalField)
    } 

    const getAdditionalFields = (item) => ({            
        ...item,
        'ResourceGroup':item.instanceData.resourceUri.split("/")[4],
        'ResourceName': item.instanceData.resourceUri.split("/")[7],
        'ResourceType': item.instanceData.resourceUri.split("/")[6],
        'usageEndTime': format(new Date(item.usageEndTime.slice(0,10)), 'dd-MMM-yyyy'),
        'usageStartTime': format(new Date(item.usageStartTime.slice(0,10)), 'dd-MMM-yyyy')
    })

    const json2csvParser = new Parser({ fields, transforms:[getAdditionalFields] })
    const csv = json2csvParser.parse(report)

    return csv
}

export default getCSV