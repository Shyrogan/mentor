<template>
  <nav class="flex flex-row justify-between items-center align-middle px-10 py-5 w-screen">
    <NuxtLink to="/">
      <Logo class="h-10" />
    </NuxtLink>
    <NavbarMenu class="space-x-2">
      <NavbarMenuItem title="Programmes de mentorat">
        <div class="p-4 grid grid-cols-2 w-[40rem]">
          <NavbarMenuCard title="Consulter l'annuaire des offres" to="/offer/list">
            Vous êtes à la recherche d'un peu d'aide ? L'annuaire vous permez de trouver ce dont
            vous avez besoin
          </NavbarMenuCard>
        </div>
      </NavbarMenuItem>
      <NavbarMenuItem title="Groupes de discussion">
        <div class="p-4 grid grid-cols-2 w-[40rem]">
          <NavbarMenuCard title="Comprendre les groupes de discussions" to="/">
            Pas facile au premier abord, pas vrai ? Pas de soucis, on est là pour vous aider.
          </NavbarMenuCard>
        </div>
      </NavbarMenuItem>
    </NavbarMenu>
    <div class="flex flex-row space-x-2">
      <NuxtLink to="/sign-in">
        <Button>
          <Icon name="lucide:scan-face" class="w-6 h-6 mr-2" /> Rejoindre la communauté
        </Button>
      </NuxtLink>
    </div>
  </nav>
</template>
