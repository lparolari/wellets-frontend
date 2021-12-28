import * as Yup from 'yup';

export default Yup.object().shape({
  alias: Yup.string().required('alias required'),
  weight: Yup.number()
    .typeError('invalid weight')
    .min(0, 'must be greater or equal to 0')
    .max(100, 'must be lower or equal to 100')
    .required('weight required'),
  pocket_id: Yup.string().uuid(),
  wallet_ids: Yup.array().of(Yup.string().uuid()),
});
