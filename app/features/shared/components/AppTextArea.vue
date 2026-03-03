<script setup lang="ts">
interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  autofocus?: boolean;
  maxlength?: number;
  rows?: number;
  highlight?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  readonly: false,
  required: false,
  rows: 4,
  highlight: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <UTextarea
    :id="id"
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :name="name"
    :autofocus="autofocus"
    :maxlength="maxlength"
    :rows="rows"
    variant="none"
    class="w-full"
    :ui="{
      root: 'w-full',
      base: [
        'w-full px-4 py-2.5 bg-gray-brand-4 rounded-lg text-sm text-gray-brand-neutral-2 placeholder:text-gray-brand-2 focus:ring-2 focus:ring-primary/20 outline-none resize-none',
        props.highlight ? 'ring-2 ring-red-500/50 border-red-500' : 'border-0',
      ],
    }"
    @input="handleInput"
  />
</template>
