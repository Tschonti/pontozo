// Unfortunately, sender domain cannot be provisoned automatically, since our domain is not hosted on Azure
resource "azurerm_communication_service" "acs" {
  name                = "pontozo-acs"
  resource_group_name = azurerm_resource_group.pontozo-rg.name
  data_location       = "Europe"
}

resource "azurerm_email_communication_service" "acs-email" {
  name                = "pontozo-acs-email"
  resource_group_name = azurerm_resource_group.pontozo-rg.name
  data_location       = "Europe"
}

resource "azurerm_eventgrid_system_topic" "acs-email-topic" {
  name                   = "pontozo-acs-email-topic"
  resource_group_name    = azurerm_resource_group.pontozo-rg.name
  location               = "Global"
  source_arm_resource_id = azurerm_communication_service.acs.id
  topic_type             = "Microsoft.Communication.CommunicationServices"
}

resource "azurerm_eventgrid_system_topic_event_subscription" "acs-email-events" {
  name                = "pontozo-acs-email-events"
  system_topic        = azurerm_eventgrid_system_topic.acs-email-topic.name
  resource_group_name = azurerm_resource_group.pontozo-rg.name

  included_event_types = ["Microsoft.Communication.EmailDeliveryReportReceived"]

  advanced_filter {
    string_in {
      key    = "data.status"
      values = ["Suppressed", "Bounced", "Quarantined", "FilteredSpam", "Failed"]
    }
  }

  azure_function_endpoint {
    function_id                       = format("%s%s", azurerm_windows_function_app.function-app.id, "/functions/emailDeliveryCallback")
    max_events_per_batch              = 10
    preferred_batch_size_in_kilobytes = 64
  }
}
