import ApplicationSerializer from './application'

export default ApplicationSerializer.extend({
  typeKeyForModel(model) {
    return `report-${model.modelName.replace('-statistic', '')}s`
  }
})
