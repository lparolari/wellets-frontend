import * as Yup from 'yup';

export default Yup.object().shape({
  value: Yup.number()
    .typeError('value must be a number')
    .required('value required')
    .positive('value must be positive'),
  description: Yup.string().required('description required'),
  type: Yup.string()
    .equals(
      ['incoming', 'outcoming'],
      'you must specify if the transaction is a incoming or a outcoming',
    )
    .required('type required'),
  base_rate: Yup.number().typeError("value must be a number").positive("value must be positive")
});
