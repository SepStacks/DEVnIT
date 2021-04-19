---
parent: "TEST"
type: "component"
category: "Components"
position: 2
version: 1.0
menuTitle: "list"
children: [
    {   id: 1,
        description: "textarea components is used for text-base things i guess.",
        title: "textarea",
        slug: "list-text-area",
        parentComponent: "list",
        parent: "TEST",
        type: "childComponent"
    }
]
---

# list

>This component was based on the list component of [Vuetify](https://vuetifyjs.com/en/components/list/ "Vuetify's list component")

## Usage

These types of ComponentName are usually used for notifications, eg. appearing onscreen the moment you logged in. ComponentName can be useful when you need to display certain message onscreen for the user/client.

<!-- Component template need to be here -->
<doc-component :file="'TEST/list/TEST_list-usage'" :name="'list'"></doc-component >

## textarea

this is a list that is used as a list lol

<doc-component :file="'TEST/list/TEST_list-textarea'" :name="'textarea'"></doc-component>