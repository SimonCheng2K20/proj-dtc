const returnGenderName = (genderCode) => {
  switch (genderCode) {
    case 'M':
      return '男';
    case 'F':
      return '女';
    default:
      return '';
  }
};

export default returnGenderName;
