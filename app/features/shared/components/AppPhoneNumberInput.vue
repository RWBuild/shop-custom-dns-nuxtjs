<script setup lang="ts">
import {
  formatIncompletePhoneNumber,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';

interface Props {
  modelValue?: string;
  defaultCountry?: CountryCode;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  highlight?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultCountry: 'RW',
  placeholder: '788 000 000',
  disabled: false,
  readonly: false,
  required: false,
  highlight: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  valid: [isValid: boolean];
}>();

const priorityCountries: CountryCode[] = [
  'RW',
  'UG',
  'KE',
  'TZ',
  'BI',
  'CD',
  'US',
  'GB',
  'FR',
  'DE',
];

const allCountries = getCountries();
const sortedCountries = computed(() => {
  const priority = priorityCountries.filter((c) => allCountries.includes(c));
  const others = allCountries.filter((c) => !priorityCountries.includes(c)).sort();
  return [...priority, ...others];
});

const countryOptions = computed(() =>
  sortedCountries.value.map((country) => ({
    label: `+${getCountryCallingCode(country)} (${country})`,
    value: country,
    callingCode: `+${getCountryCallingCode(country)}`,
  }))
);

const selectedCountry = ref<CountryCode>(props.defaultCountry);

const nationalDigits = ref('');

let isInternalUpdate = false;

const maxPhoneLength = computed(() => {
  try {
    const example = getExampleNumber(selectedCountry.value, examples);
    if (example) {
      return example.nationalNumber.length;
    }
  } catch {
    // Fallback
  }
  return 10;
});


const displayValue = computed(() => {
  if (!nationalDigits.value) return '';

  const formatted = formatIncompletePhoneNumber(nationalDigits.value, selectedCountry.value);

  return formatted;
});

const currentCallingCode = computed(() => `+${getCountryCallingCode(selectedCountry.value)}`);


function parseFromModelValue(value: string | undefined) {
  if (!value) {
    nationalDigits.value = '';
    return;
  }

  const parsed = parsePhoneNumberFromString(value);
  if (parsed) {
    if (parsed.country) {
      selectedCountry.value = parsed.country as CountryCode;
    }
    nationalDigits.value = parsed.nationalNumber;
  } else {
    const digits = value.replace(/\D/g, '');
    const callingCode = getCountryCallingCode(selectedCountry.value);

   
    if (digits.startsWith(callingCode)) {
      nationalDigits.value = digits.slice(callingCode.length);
    } else {
      nationalDigits.value = digits;
    }
  }
}


onMounted(() => {
  if (props.modelValue) {
    parseFromModelValue(props.modelValue);
    validateAndEmit();
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (isInternalUpdate) return;
    parseFromModelValue(newValue);
  }
);

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;

  let digits = input.value.replace(/\D/g, '');

  digits = digits.slice(0, maxPhoneLength.value);

  nationalDigits.value = digits;

  validateAndEmit();
}

function handleCountryChange(country: CountryCode) {
  selectedCountry.value = country;
  // Trim digits if they exceed new country's max length
  if (nationalDigits.value.length > maxPhoneLength.value) {
    nationalDigits.value = nationalDigits.value.slice(0, maxPhoneLength.value);
  }
  validateAndEmit();
}

function validateAndEmit() {
  const digits = nationalDigits.value;

  if (!digits) {
    isInternalUpdate = true;
    emit('update:modelValue', '');
    emit('valid', false);
    nextTick(() => {
      isInternalUpdate = false;
    });
    return;
  }

  const callingCode = getCountryCallingCode(selectedCountry.value);
  const fullNumber = `+${callingCode}${digits}`;


  const parsed = parsePhoneNumberFromString(fullNumber, selectedCountry.value);
  const isValid = parsed?.isValid() || false;

  isInternalUpdate = true;
  emit('valid', isValid);
  emit('update:modelValue', fullNumber);
  nextTick(() => {
    isInternalUpdate = false;
  });
}
</script>

<template>
  <div class="flex w-full gap-2">
    <USelectMenu
      :model-value="selectedCountry"
      :items="countryOptions"
      value-key="value"
      :disabled="disabled || readonly"
      class="w-24"
      :ui="{
        base: 'w-full px-3 py-2 bg-gray-brand-4 rounded-lg text-sm text-gray-brand-neutral-2 focus:ring-2 focus:ring-primary/20 !border-0 outline-none cursor-pointer !outline-none',
        value: 'text-gray-brand-neutral-2 font-medium',
        placeholder: 'text-gray-brand-2',
        content: 'max-h-60 z-[100]',
      }"
      @update:model-value="handleCountryChange"
    >
      <template #default>
        <span class="font-medium">{{ currentCallingCode }}</span>
      </template>

      <template #item="{ item }">
        <span class="font-medium">{{ item.callingCode }}</span>
        <span class="ml-1 text-xs text-gray-brand-2">({{ item.value }})</span>
      </template>
    </USelectMenu>

    <input
      :id="id"
      :name="name"
      :value="displayValue"
      type="tel"
      inputmode="numeric"
      autocomplete="tel-national"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :maxlength="maxPhoneLength + 3"
      :class="[
        'flex-1 px-4 py-2 bg-gray-brand-4 rounded-lg text-sm text-gray-brand-neutral-2',
        'placeholder:text-gray-brand-2 focus:ring-2 focus:ring-primary/20 outline-none border-0',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        props.highlight ? 'ring-1 ring-red-500' : '',
      ]"
      @input="handlePhoneInput"
    >
  </div>
</template>
