<script setup lang="ts">
interface Props {
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  autofocus?: boolean;
  maxlength?: number;
  icon?: string;
  trailingIcon?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <UInput
    :id="id"
    :model-value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :name="name"
    :autofocus="autofocus"
    :maxlength="maxlength"
    :icon="icon"
    :trailing-icon="trailingIcon"
    variant="none"
    class="w-full"
    :ui="{
      root: 'w-full',
      base: 'w-full px-4 py-2 bg-gray-brand-4 rounded-lg text-sm text-gray-brand-neutral-2 placeholder:text-gray-brand-2 focus:ring-2 focus:ring-primary/20 border-0 outline-none',
    }"
    @input="handleInput"
  />
</template>
