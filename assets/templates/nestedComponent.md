---
parent: "{{slug}}"
type: "child-component"
category: "Components"
position: 3
version: 1.0
Prefix: "{{prefix}}"
menuTitle: "{{slug}}-{{prefix}}"
---

# {{prefix}}

{{description}}

<!-- Component template need to be here -->
<doc-component :file="'{{parent}}/{{slug}}/{{parent}}_{{slug}}-{{prefix}}'"></doc-component>
