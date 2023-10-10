<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from '../routes/$types';
	import Icon from '@iconify/svelte';
	import { triggerAction } from '../utils/triggerAction';

	$: ({ session } = $page.data as PageData);
	$: urlPath = $page.url.pathname;
</script>

<div class="navbar shadow px-4 flex justify-between">
	<a href="/" class="text-xl font-bold">GenRep</a>
	<div class="flex gap-5">
		<a href="/databases" class="btn btn-link {urlPath !== '/databases' && 'no-underline text-base-content'}">
			Databases
		</a>
		<details class="dropdown dropdown-end">
			<summary class="btn btn-ghost btn-circle avatar p-1">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img src={session?.user_picture} alt="Profile Picture" class="rounded-full" />
			</summary>
			<div class="dropdown-content mt-4 z-[1] border shadow rounded-box w-64">
				<div class="p-5 pb-2">
					<div class="font-semibold">{session?.user.name}</div>
					<div class="italic">{session?.user.email}</div>
				</div>
				<div class="divider px-4 m-0" />
				<ul class="menu">
					<li>
						<a href="/settings"><Icon icon="material-symbols:settings-rounded" width={20} /> Settings</a>
					</li>
					<li>
						<button on:click={() => triggerAction('/logout')}>
							<Icon icon="material-symbols:logout-rounded" width={20} /> Logout
						</button>
					</li>
				</ul>
			</div>
		</details>
	</div>
</div>
