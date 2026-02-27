<script setup lang="ts">
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
  type CountryCode,
} from 'libphonenumber-js';

interface Props {
  modelValue?: string;
  defaultCountry?: CountryCode;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultCountry: 'RW',
  placeholder: '000 000 000',
  disabled: false,
  readonly: false,
  required: false,
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
const phoneNumber = ref('');

function parseInitialValue() {
  if (!props.modelValue) return;

  try {
    const parsed = parsePhoneNumber(props.modelValue);
    if (parsed) {
      selectedCountry.value = (parsed.country as CountryCode) || props.defaultCountry;
      phoneNumber.value = parsed.nationalNumber;
    }
  } catch {
    phoneNumber.value = props.modelValue.replace(/^\+\d+/, '');
  }
}

watch(
  () => props.modelValue,
  () => parseInitialValue(),
  { immediate: true }
);

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const rawValue = input.value.replace(/\D/g, '');
  const formatter = new AsYouType(selectedCountry.value);
  phoneNumber.value = formatter.input(rawValue);
  emitValue();
}

function handleCountryChange(country: CountryCode) {
  selectedCountry.value = country;
  emitValue();
}

function emitValue() {
  const callingCode = getCountryCallingCode(selectedCountry.value);
  const cleanNumber = phoneNumber.value.replace(/\D/g, '');

  if (!cleanNumber) {
    emit('update:modelValue', '');
    emit('valid', false);
    return;
  }

  const fullNumber = `+${callingCode}${cleanNumber}`;

  try {
    const parsed = parsePhoneNumber(fullNumber);
    emit('valid', parsed?.isValid() || false);
  } catch {
    emit('valid', false);
  }

  emit('update:modelValue', fullNumber);
}

const currentCallingCode = computed(() => `+${getCountryCallingCode(selectedCountry.value)}`);
</script>

<template>
  <div class="flex gap-2 w-full">
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
        content: 'max-h-60',
      }"
      @update:model-value="handleCountryChange"
    >
      <template #default>
        <span class="font-medium">{{ currentCallingCode }}</span>
      </template>

      <template #item="{ item }">
        <span class="font-medium">{{ item.callingCode }}</span>
        <span class="text-gray-brand-2 text-xs ml-1">({{ item.value }})</span>
      </template>
    </USelectMenu>

    <input
      :id="id"
      :name="name"
      :value="phoneNumber"
      type="tel"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :class="[
        'flex-1 px-4 py-2 bg-gray-brand-4 rounded-lg text-sm text-gray-brand-neutral-2',
        'placeholder:text-gray-brand-2 focus:ring-2 focus:ring-primary/20 outline-none border-0',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @input="handlePhoneInput"
    />
  </div>
</template>
