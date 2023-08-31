const StatusField = {
  name: 'status',
  type: 'select',
  options: [
    {
      value: 'draft',
      label: 'Draft'
    },
    {
      value: 'published',
      label: 'Published'
    }
  ],
  defaultValue: 'draft',
  admin: {
    position: 'sidebar'
  }
};

export default StatusField;
