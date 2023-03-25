<script lang="ts">
	import { enhance } from '$app/forms';
	import { Avatar, FileDropzone } from '@skeletonlabs/skeleton';
	import { afterUpdate } from 'svelte';
	import type { PageServerData } from './$types';
	import { confettiAction } from 'svelte-legos';

	export let data: PageServerData;

	let img = `/${data.img}.${data.extension}` ?? 'https://i.pravatar.cc/?img=48';

	let isNewImg = false;

	function onChangeHandler(e: Event): void {
		isNewImg = true;
		const target = e.target as HTMLInputElement;
		const files = target.files as FileList;
		const file = files[0];
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.addEventListener('load', (e) => {
			const result = e.target?.result as string;

			console.log({ result });

			img = result;
		});
		// here we can build an upload progress bar
		reader.addEventListener('progress', () => {});
	}

	afterUpdate(() => {});
</script>

<section class="flex flex-col gap-4 p-4">
	<form
		method="post"
		action="?/uploadImg"
		use:enhance={() => {
			// when the form is submitted, reset the isNewImg flag
			isNewImg = false;
		}}
		enctype="multipart/form-data"
		class="flex flex-col gap-4"
	>
		<FileDropzone name="files" on:change={onChangeHandler} />
		{#if isNewImg}
			<button
				class="btn variant-filled"
				type="submit"
				use:confettiAction={{
					type: 'school-pride'
				}}
			>
				Guardar
			</button>
		{/if}
	</form>
	<section class="flex items-center justify-center">
		<Avatar src={`${img}`} width="w-80" />
	</section>
</section>
