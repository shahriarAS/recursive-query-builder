## Challenge: Recursive Visual Query Builder

### Brief
Build a visual query builder that allows users to create complex nested logical conditions (AND/OR) with drag-and-drop functionality.

### Requirements
- **Visual Structure**: Tree-like interface with nested groups
- **Drag & Drop**: 
  - Drag conditions between groups
  - Drag entire groups to reorder
  - Drop zones highlight when valid
- **Recursive Logic**: Support unlimited nesting of AND/OR groups
- **Interactivity**: 
  - Add/remove conditions and groups dynamically
  - Toggle between AND/OR logic for each group
  - Real-time preview of the generated query
- **Data Structure**: Maintain a nested object structure representing the query tree

### Visual Layout
```
Query Builder
├── AND Group
│   ├── [Condition: age > 25] [×]
│   ├── [Condition: status = "active"] [×]
│   └── OR Group
│       ├── [Condition: role = "admin"] [×]
│       └── [Condition: department = "IT"] [×]
└── [+ Add Condition] [+ Add Group]
```

### Constraints
- No external drag-drop libraries
- Must handle deep nesting (5+ levels)
- Query object must be properly structured for recursive evaluation
- Visual feedback for all drag operations

---