variable "MTFSZ_CLIENT_ID" {
  type      = string
  sensitive = true
}

variable "MTFSZ_CLIENT_SECRET" {
  type      = string
  sensitive = true
}

variable "MTFSZ_API_HOST" {
  type      = string
  sensitive = true
}

resource "azurerm_api_management" "apim" {
  name                = "pontozo-apim-tf"
  location            = "West Europe"
  resource_group_name = azurerm_resource_group.tf-rg.name
  publisher_name      = "Fekete Sámuel"
  publisher_email     = "feketesamu@gmail.com"

  sku_name = "Consumption_0"

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_api_management_api" "mtfsz-api" {
  name                  = "mtfsz"
  resource_group_name   = azurerm_resource_group.tf-rg.name
  api_management_name   = azurerm_api_management.apim.name
  revision              = "1"
  display_name          = "MTFSZ API"
  protocols             = ["https"]
  service_url           = format("%s/api/v1_0", var.MTFSZ_API_HOST)
  subscription_required = true
  subscription_key_parameter_names {
    header = "Ocp-Apim-Subscription-Key"
    query  = "subscription-key"
  }
}

resource "azurerm_api_management_api_operation" "get-events" {
  operation_id        = "get-events"
  api_name            = azurerm_api_management_api.mtfsz-api.name
  api_management_name = azurerm_api_management_api.mtfsz-api.api_management_name
  resource_group_name = azurerm_api_management_api.mtfsz-api.resource_group_name
  display_name        = "Get all events"
  method              = "GET"
  url_template        = "/esemenyek"

  request {
    query_parameter {
      name     = "esemeny_id"
      type     = "integer"
      required = false
    }
  }


  response {
    status_code = 200
  }

}

resource "azurerm_api_management_api_operation" "get-user" {
  operation_id        = "get-user"
  api_name            = azurerm_api_management_api.mtfsz-api.name
  api_management_name = azurerm_api_management_api.mtfsz-api.api_management_name
  resource_group_name = azurerm_api_management_api.mtfsz-api.resource_group_name
  display_name        = "Get user by ID"
  method              = "GET"
  url_template        = "/szemelyek/{userId}"

  template_parameter {
    name     = "userId"
    type     = "number"
    required = true
  }


  response {
    status_code = 200
  }
}

resource "azurerm_api_management_api_operation" "search-users" {
  operation_id        = "search-users"
  api_name            = azurerm_api_management_api.mtfsz-api.name
  api_management_name = azurerm_api_management_api.mtfsz-api.api_management_name
  resource_group_name = azurerm_api_management_api.mtfsz-api.resource_group_name
  display_name        = "Search users"
  method              = "GET"
  url_template        = "/szemelyek"

  request {
    query_parameter {
      name     = "vezeteknev"
      type     = "string"
      required = false
    }

    query_parameter {
      name     = "keresztnev"
      type     = "string"
      required = false
    }

    query_parameter {
      name     = "szul_ev"
      type     = "number"
      required = false
    }
  }


  response {
    status_code = 200
  }
}

resource "azurerm_api_management_api_policy" "mtfsz-api-policy" {
  api_name            = azurerm_api_management_api.mtfsz-api.name
  api_management_name = azurerm_api_management_api.mtfsz-api.api_management_name
  resource_group_name = azurerm_api_management_api.mtfsz-api.resource_group_name


  xml_content = <<XML
<policies>
    <inbound>
        <base />
        <cors allow-credentials="false">
            <allowed-origins>
                <origin>http://localhost:3001/</origin>
                <origin>https://pontozo.mtfsz.hu/</origin>
                <origin>${format("%s%s", "https://", azurerm_static_web_app.swa.default_host_name)}</origin>
            </allowed-origins>
            <allowed-methods>
                <method>GET</method>
            </allowed-methods>
        </cors>
        <get-authorization-context provider-id="mtfsz" authorization-id="mtfsz" context-variable-name="auth-context" identity-type="managed" ignore-error="false" />
        <set-header name="Authorization" exists-action="override">
            <value>@("Bearer " + ((Authorization)context.Variables.GetValueOrDefault("auth-context"))?.AccessToken)</value>
        </set-header>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
XML
}

# resource "azapi_resource" "auth-provider" {
#   type      = "Microsoft.ApiManagement/service/authorizationProviders@2023-05-01-preview"
#   name      = "mtfsz"
#   parent_id = azurerm_api_management.apim.id
#   body = jsonencode({
#     properties = {
#       displayName      = "MTFSZ"
#       identityProvider = "oauth2"
#       oauth2 = {
#         grantTypes = {
#           clientCredentials = {
#             authorizationUrl = "https://api.mtfsz.hu/oauth/v2/auth"
#             tokenUrl         = "https://api.mtfsz.hu/oauth/v2/token"
#           }
#         }
#       }
#     }
#   })
# }


resource "azurerm_api_management_subscription" "backend-sub" {
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = azurerm_api_management.apim.resource_group_name
  display_name        = "Functions App subscription"
  state               = "active"
}

resource "azurerm_api_management_subscription" "frontend-sub" {
  api_management_name = azurerm_api_management.apim.name
  resource_group_name = azurerm_api_management.apim.resource_group_name
  display_name        = "Client App subscription"
  state               = "active"
}

output "frontend-subscription-key" {
  value     = azurerm_api_management_subscription.frontend-sub.primary_key
  sensitive = true
}
