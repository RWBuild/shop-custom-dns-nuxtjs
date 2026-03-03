<script setup lang="ts">
interface Props {
  modelValue: number;
  min?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

function decrement() {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1);
  }
}

function increment() {
  if (props.modelValue) {
    emit('update:modelValue', props.modelValue + 1);
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let value = parseInt(target.value, 10);

  if (isNaN(value) || value < props.min) {
    value = props.min;
  }

  emit('update:modelValue', value);
}
</script>

<template>
  <div class="inline-flex items-center rounded-full border border-gray-300">
    <button
      type="button"
      class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-l-full text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="disabled || modelValue <= min"
      @click="decrement"
    >
      <UIcon name="i-heroicons-minus" class="size-3" />
    </button>

    <input
      type="number"
      :value="modelValue"
      :min="min"
      :disabled="disabled"
      class="h-7 w-8 border-x border-gray-300 bg-transparent text-center text-xs font-medium text-gray-900 focus:outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      @input="handleInput"
    >

    <button
      type="button"
      class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-r-full text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="disabled"
      @click="increment"
    >
      <UIcon name="i-heroicons-plus" class="size-3" />
    </button>
  </div>
</template>
