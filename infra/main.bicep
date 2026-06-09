targetScope = 'subscription'

@minLength(1)
@description('The azd environment name used for resource naming and tagging.')
param environmentName string

@description('Azure region for the Container Apps hosting resources.')
param location string = 'swedencentral'

var cleanedEnvironmentName = take(replace(replace(replace(toLower(environmentName), '-', ''), '_', ''), ' ', ''), 18)
var resourceSuffix = take(uniqueString(subscription().id, environmentName, location), 8)
var tags = {
  'azd-env-name': environmentName
  workload: 'webslides'
}

resource resourceGroup 'Microsoft.Resources/resourceGroups@2024-07-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module hosting './modules/hosting.bicep' = {
  name: 'hosting'
  scope: resourceGroup
  params: {
    environmentName: environmentName
    resourceSuffix: resourceSuffix
    containerAppLocation: location
    tags: tags
  }
}

output AZURE_RESOURCE_GROUP string = resourceGroup.name
output VITE_SERVER_URL string = hosting.outputs.apiUrl
output WEBSLIDES_EXPORT_ALLOWED_HOSTS string = hosting.outputs.webHostname
output WEBSLIDES_CORS_ALLOWED_ORIGINS string = hosting.outputs.webUrl
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = hosting.outputs.containerRegistryEndpoint
output AZURE_WEB_CONTAINER_APP_NAME string = hosting.outputs.webContainerAppName
output AZURE_API_CONTAINER_APP_NAME string = hosting.outputs.apiContainerAppName
output AZURE_WEB_CONTAINER_APP_HOSTNAME string = hosting.outputs.webHostname
output AZURE_API_CONTAINER_APP_HOSTNAME string = hosting.outputs.apiHostname
