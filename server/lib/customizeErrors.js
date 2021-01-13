import i18next from 'i18next';

export default (errors) => {
  const customizeMessages = (errorData) => {
    const customized = { ...errorData };
    switch (errorData.keyword) {
      case 'minLength':
        customized.message = i18next.t('views.errors.minLength');
        break;
      case 'format':
        customized.message = i18next.t('views.errors.format');
        break;
      default:
        customized.message = i18next.t('views.errors.default');
        break;
    }
    return customized;
  };

  return Object.entries(errors).reduce((acc, errorData) => {
    const [entity, data] = errorData;
    const result = {};
    result[entity] = data.map((error) => customizeMessages(error));
    return { ...acc, ...result };
  }, {});
};
