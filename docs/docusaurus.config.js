/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Captain's Log",
  tagline: 'A continuous integration plugin that will send release information via slack.',
  url: 'https://target.github.io',
  baseUrl: '/captains-log/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'target', // Usually your GitHub org/user name.
  projectName: 'captains-log', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Captain's Log",
      logo: {
        alt: "Captain's Log",
        src: 'img/favicon.ico',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/target/captains-log',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/target/captains-log',
            },
          ],
        },
      ],
      copyright: `Captain's Log, built with Docusaurus`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
