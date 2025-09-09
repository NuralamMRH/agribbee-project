import { m, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Button, Box, Link, Container, Typography, Stack, Grid, Card } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_FIGMA_PREVIEW, PATH_FREE_VERSION } from '../../routes/paths';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
import { textGradient, bgGradient } from '../../utils/cssStyles';
// config
import { HEADER } from '../../config-global';
// theme
import { secondaryFont } from '../../theme/typography';
// components
import SvgColor from '../../components/svg-color';
import Iconify from '../../components/iconify';
import { MotionContainer, varFade } from '../../components/animate';
import Image from '@/components/image';
import { useLocales } from '@/locales';
import { borderRadius, padding } from '@mui/system';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: '/assets/icons/i-truck-sea/selling_14644467.svg',
    title: 'Chợ Nổi Thu Mua',
    description: 'Procurement Offshore Market',
  },
  {
    icon: '/assets/icons/i-truck-sea/buoy_17906108 1.svg',
    title: 'Chành Vận Chuyển Biển',
    description: 'Boat4Share Transport',
  },
];

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
  padding: theme.spacing(5, 2),
  [theme.breakpoints.up('md')]: {
    boxShadow: 'none',
  },
}));

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_2.jpg',
  }),
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    position: 'fixed',
    alignItems: 'center',
  },
}));

const StyledDescription = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(5, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
  height: '100%',
}));

const StyledGradientText = styled(m.h1)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontFamily: secondaryFont.style.fontFamily,
  fontSize: `${64 / 55}rem`,
  textAlign: 'center',
  lineHeight: 1,
  padding: 0,
  marginTop: 8,
  marginBottom: 24,
  letterSpacing: 8,
  [theme.breakpoints.up('md')]: {
    fontSize: `${96 / 55}rem`,
  },
}));

const StyledEllipseTop = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: 480,
  height: 480,
  top: -80,
  right: -80,
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.12),
}));

const StyledEllipseBottom = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: 400,
  bottom: -200,
  left: '10%',
  right: '10%',
  borderRadius: '50%',
  filter: 'blur(100px)',
  WebkitFilter: 'blur(100px)',
  backgroundColor: alpha(theme.palette.primary.darker, 0.08),
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const isDesktop = useResponsive('up', 'md');

  const { translate } = useLocales();

  return (
    <>
      <StyledRoot>
        <Container sx={{ height: 1, paddingY: { xs: 5 }, marginTop: { md: 10 } }}>
          <Grid container spacing={isDesktop ? 10 : 0} sx={{ height: 1 }}>
            <Grid item xs={12} md={6} sx={{ height: 1 }}>
              <Description />
            </Grid>

            <Grid container item xs={12} md={6} sx={{ height: 1 }}>
              <Box
                gap={{ xs: 2, lg: 2 }}
                display="grid"
                alignItems="center"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                {CARDS.map((card, index) => (
                  <m.div variants={varFade().inUp} key={card.title}>
                    <Button component={NextLink} href={PATH_DASHBOARD.root} color="inherit">
                      <StyledCard
                        sx={{
                          boxShadow: (theme) => ({
                            md: `-40px 40px 80px ${
                              theme.palette.mode === 'light'
                                ? alpha(theme.palette.grey[500], 0.16)
                                : alpha(theme.palette.common.black, 0.4)
                            }`,
                          }),
                        }}
                      >
                        <Image
                          src={card.icon}
                          alt={translate(card.title)}
                          sx={{
                            mx: 'auto',
                            width: 80,
                            height: 80,
                            padding: 2,
                            backgroundColor: (theme) => theme.palette.primary.main,
                            borderRadius: 50,
                          }}
                        />

                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                          {translate(card.title)}
                        </Typography>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {translate(card.description)}
                        </Typography>
                      </StyledCard>
                    </Button>
                  </m.div>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* <StyledEllipseTop /> */}

        <StyledEllipseBottom />
      </StyledRoot>

      <Box sx={{ height: { md: '100vh' } }} />
    </>
  );
}

// ----------------------------------------------------------------------

function Description() {
  return (
    <StyledDescription>
      <m.div variants={varFade().in}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Chợ Cung Ứng Vận CHuyển Ngoài Khơi
        </Typography>
      </m.div>

      <m.div variants={varFade().in}>
        <StyledGradientText
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
        >
          FISH AUCTION MARKET & BOAT-SHARE
        </StyledGradientText>
      </m.div>

      {/* <m.div variants={varFade().in}>
        <Stack spacing={1.5} direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ my: 5 }}>
          <Stack alignItems="center" spacing={2}>
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.root}
              color="inherit"
              size="large"
              variant="contained"
              startIcon={<Iconify icon="eva:flash-fill" width={24} />}
              sx={{
                bgcolor: 'text.primary',
                color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
                '&:hover': {
                  bgcolor: 'text.primary',
                },
              }}
            >
              Live Preview
            </Button>
          </Stack>

          <Button
            color="inherit"
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="eva:external-link-fill" width={24} />}
            target="_blank"
            rel="noopener"
            href={PATH_FIGMA_PREVIEW}
            sx={{ borderColor: 'text.primary' }}
          >
            Design Preview
          </Button>
        </Stack>
      </m.div> */}
    </StyledDescription>
  );
}

// ----------------------------------------------------------------------
