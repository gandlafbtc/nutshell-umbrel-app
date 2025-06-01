<script lang="ts">
	import type { PageData } from "../routes/$types";


	interface Props {data: PageData}
	
	let {data}: Props = $props();

	let configContent = $state(data.configData || '');
	let saved = $state(false);
	let error = $state('');
	let isSubmitting = $state(false);

	// Reset notification after a delay
	function resetNotifications() {
		setTimeout(() => {
			saved = false;
			error = '';
		}, 3000);
	}

	// Custom form submission handler to prevent page reload
	async function handleSubmit() {
		isSubmitting = true;
		try {
			const response = await fetch('/api/configure', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({content: configContent})
			});
			
			const result = await response.json();
			
			if (result.success) {
				saved = true;
			} else {
				error = result.error || 'Failed to save configuration';
			}
		} catch (err) {
			console.error('Error submitting form:', err);
			error = 'Failed to save configuration';
		} finally {
			isSubmitting = false;
			resetNotifications();
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-2xl font-bold mb-6">Configure Cashu Mint</h1>
	
	<div class="mb-6">
		<p class="text-gray-600 mb-4">
			Edit the configuration file below. This file controls the behavior of your Cashu mint.
		</p>
	</div>

	{#if saved}
	<div role="alert" class="alert alert-success">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
		  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
		<span>Configuration updated successfully!</span>
	  </div>
	{/if}

	{#if error}
	<div role="alert" class="alert alert-error">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
		  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
		<p>Error: {error}</p>
	  </div>
	{/if}

		<div class="mb-4">
			<label for="configContent" class="block text-gray-700 text-sm font-bold mb-2">
				Configuration (.env)
			</label>
			<textarea
				id="configContent"
				name="configContent"
				bind:value={configContent}
				class="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
				spellcheck="false"
			></textarea>
		</div>

		<div class="flex justify-end">
			<button
				class="btn btn-primary"
				disabled={isSubmitting}
				onclick={()=>{
					  handleSubmit()
				}}
				>
				{#if isSubmitting}
					Saving...
				{:else}
					Save Configuration
				{/if}
			</button>
		</div>
</div>
