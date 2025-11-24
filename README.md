# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3a9be153-0265-49b3-b45d-07266cab921c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3a9be153-0265-49b3-b45d-07266cab921c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Configure contract addresses

Deploy `SentrixRegistry` and `SentrixLicensing` (see `contracts/README.md`) and copy the addresses into a local `.env` file:

```
VITE_SENTRIX_REGISTRY_ADDRESS=0xRegistryAddress
VITE_SENTRIX_LICENSING_ADDRESS=0xLicensingAddress
```

Restart `npm run dev` after changing env vars so the wallet + marketplace views use the new contracts.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Smart contracts

Solidity sources live under `contracts/`:

- `SentrixRegistry.sol` keeps track of IP assets and metadata URIs
- `SentrixLicensing.sol` issues programmable licenses that settle payments on acceptance

### Current deployment (Mantle Sepolia)

- `SentrixRegistry`: `0xD65143F3861d7fc09514c4e5bDA0264Bd4EE2EF1`
- `SentrixLicensing`: `0x98E066d8Fe0dCcA41005EB2f3E45179cEbE9FC2C`

Deploy both contracts (any EVM chain) and copy their addresses into a `.env` file:

```
VITE_SENTRIX_REGISTRY_ADDRESS=0xRegistryAddressHere
VITE_SENTRIX_LICENSING_ADDRESS=0xLicensingAddressHere
```

Restart `npm run dev` after changing env vars.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3a9be153-0265-49b3-b45d-07266cab921c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
