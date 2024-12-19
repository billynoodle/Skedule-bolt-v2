export const getStatusColor = (status: 'active' | 'completed' | 'on-hold') => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'on-hold':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status: 'active' | 'completed' | 'on-hold') => {
  switch (status) {
    case 'active':
      return 'play';
    case 'completed':
      return 'check';
    case 'on-hold':
      return 'pause';
    default:
      return 'help';
  }
};