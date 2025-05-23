import { RHFSwitch } from './rhf-switch';
import { RHFSelect } from './rhf-select';
import { RHFUploadAvatar } from './rhf-upload';
import { RHFTextField } from './rhf-text-field';
import { RHFPhoneInput } from './rhf-phone-input';
import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFCountrySelect } from './rhf-country-select';

// ----------------------------------------------------------------------

export const Field = {
  Select: RHFSelect,
  Text: RHFTextField,
  Switch: RHFSwitch,
  Phone: RHFPhoneInput,
  CountrySelect: RHFCountrySelect,
  UploadAvatar: RHFUploadAvatar,
  Autocomplete: RHFAutocomplete,
};
