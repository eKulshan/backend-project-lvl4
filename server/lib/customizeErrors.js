import i18next from 'i18next';

export default (errors = {}) => {
  const customizeMessages = (errorData) => (
    { ...errorData, message: i18next.t(`views.errors.${errorData.keyword}`) }
  );

  return Object
    .entries(errors)
    .reduce((acc, [entity, data]) => ({
      ...acc,
      [entity]: data.map((errorData) => customizeMessages(errorData)),
    }), {});
};
