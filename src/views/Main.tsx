import mdDark from 'github-markdown-css/github-markdown-dark.css?raw';
import mdLight from 'github-markdown-css/github-markdown-light.css?raw';
import { changeLanguage } from 'i18next';
import prismLight from 'prism-themes/themes/prism-vs.css?raw';
import prismDark from 'prism-themes/themes/prism-vsc-dark-plus.css?raw';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet } from 'react-router-dom';
import tw, { css, styled } from 'twin.macro';
import IconPosts from '~icons/ri/article-line';
import IconProjects from '~icons/ri/function-line';
import IconGithub from '~icons/ri/github-line';
import IconLanguage from '~icons/ri/global-line';
import IconEmail from '~icons/ri/mail-line';
import IconDark from '~icons/ri/moon-line';
import IconSnippets from '~icons/ri/sticky-note-line';
import IconLight from '~icons/ri/sun-line';

import useDarkMode, { DarkModeValueContext } from '../hooks/use-dark-mode';
import i18n from '../i18n';
import { loadThemeStyles } from '../utils';

const title = import.meta.env.VITE_TITLE;
const email = import.meta.env.VITE_EMAIL;
const githubUrl = import.meta.env.VITE_GITHUB_URL;
const owner = import.meta.env.VITE_GITHUB_OWNER;

const Wrapper = styled.div`
  ${tw`relative pb-16 min-h-screen flex flex-col`}
`;

const Header = tw.header`h-24 w-full`;

const HeaderCenter = tw.div`mx-auto max-w-screen-lg flex px-8 items-center h-full text-slate-500 font-semibold`;

const TitleLink = styled(Link)`
  ${tw`text-lg mr-8`}
`;

const Title = tw.span`text-xl font-bold text-gray-900 dark:text-white`;

const Nav = tw.nav`grid gap-4 lg:gap-8 grid-flow-col ml-auto leading-5`;

const navItemStyle = tw`text-sm opacity-60 cursor-pointer hover:(opacity-100 text-emerald-600 dark:text-emerald-400)`;

const NavItem = styled.a`
  ${navItemStyle}
`;

const NavLinkItem = styled(NavLink)`
  ${navItemStyle}

  &.active {
    ${tw`opacity-100 text-emerald-600 dark:text-emerald-400`}
  }
`;

const Divider = tw.div`w-[1px] h-full bg-gray-300 dark:bg-gray-700`;

const Footer = tw.footer`
  absolute bottom-4 left-0 
  space-x-2 w-full
  text-xs text-center text-slate-400
  select-none
`;

const FooterCenter = tw.div`mx-auto max-w-screen-lg dark:text-slate-500`;

export default function Main() {
  const { t } = useTranslation();

  const [darkModeEnabled, setDarkModelEnabled] = useDarkMode();

  useEffect(() => {
    loadThemeStyles('prism-theme', darkModeEnabled ? prismDark : prismLight);
    loadThemeStyles('markdown-theme', darkModeEnabled ? mdDark : mdLight);
  }, [darkModeEnabled]);

  const onToggleDarkMode = useCallback(() => {
    setDarkModelEnabled(!darkModeEnabled);
  }, [darkModeEnabled]);

  const onToggleLanguage = useCallback(() => {
    changeLanguage(i18n.language === 'cn' ? 'en' : 'cn');
    localStorage.setItem('language', i18n.language);
  }, []);

  return (
    <DarkModeValueContext.Provider value={darkModeEnabled}>
      <Wrapper>
        <Header>
          <HeaderCenter>
            <TitleLink to="/">
              <Title>{title}</Title>
            </TitleLink>

            <Nav>
              <NavLinkItem to="/posts">
                <span>{t('tab.posts')}</span>
              </NavLinkItem>
              <NavLinkItem to="/snippets">
                <span>{t('tab.snippets')}</span>
              </NavLinkItem>
              <NavLinkItem to="/projects">
                <span>{t('tab.projects')}</span>
              </NavLinkItem>

              <Divider />

              {email && (
                <NavItem href={`mailto:${email}`}>
                  <IconEmail />
                </NavItem>
              )}
              <NavItem href={githubUrl} target="_blank">
                <IconGithub />
              </NavItem>
              <NavItem onClick={onToggleLanguage}>
                <IconLanguage />
              </NavItem>
              <NavItem onClick={onToggleDarkMode}>
                {darkModeEnabled ? <IconLight /> : <IconDark />}
              </NavItem>
            </Nav>
          </HeaderCenter>
        </Header>

        <Outlet />

        <Footer>
          <FooterCenter>
            <a tw="hover:text-emerald-600 dark:hover:text-emerald-400" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
              CC BY-NC-SA 4.0
            </a>
            <span tw="ml-2">2016-present © {owner}</span>
          </FooterCenter>
        </Footer>
      </Wrapper>
    </DarkModeValueContext.Provider>
  );
}
