import React, { useEffect, useState } from 'react';
import {
    Button, Paper, Badge, Box, Divider,
    Dialog, DialogContent, DialogActions, DialogTitle, Stack,
} from '@mui/material';
import iconPNG from './icon.png'
import { Trans, useTranslation } from 'react-i18next'
import * as api from './api'
import * as remote from './remote'
import { SponsorAboutBanner } from './types';

interface Props {
    open: boolean
    version: string
    lang: string
    close(): void
}

export default function AboutWindow(props: Props) {
    const { t } = useTranslation()
    const [sponsorBanners, setSponsorBanners] = useState<SponsorAboutBanner[]>([])
    useEffect(() => {
        if (props.open) {
            remote.listSponsorAboutBanner().then(setSponsorBanners)
        } else {
            setSponsorBanners([])
        }
    }, [props.open])
    return (
        <Dialog open={props.open} onClose={props.close} fullWidth>
            <DialogTitle>{t('About ChatCloud')}</DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: 'center', padding: '0 20px' }}>
                    <img src={iconPNG} style={{ width: '100px', margin: 0 }} />
                    <h3 style={{ margin: '4px 0 5px 0' }}>ChatCloud</h3>
                    <h4 style={{ margin: '4px 0 5px 0' }}>专业稳定的 AI 对话系统</h3>
                    <span>
                        <a href={`https://openkey.cloud/`} target='_blank'></a>
                    </span>
                </Box>
                <Stack spacing={2} direction="row" sx={{ justifyContent: 'center', marginTop: '10px' }}>
                    <Button variant="outlined"
                        onClick={() => api.openLink(`https://openkey.cloud/`)}
                    >
                        <a href={`https://openkey.cloud/`} target='_blank' style={{ textDecoration: 'none', color: 'CC3539' }}>OpenKEY网址</a>
                    </Button>
                    <Button variant="outlined"
                        onClick={() => api.openLink(`https://shop.terobox.com/`)}
                    >
                        <a href={`https://shop.terobox.com/`} target='_blank' style={{ textDecoration: 'none', color: 'CC3539' }}>购买地址1：Box小铺</a>
                    </Button>
                    <Button variant="outlined"
                        onClick={() => api.openLink(`https://shop.51buygpt.com/`)}
                    >
                        <a href={`https://shop.51buygpt.com/`} target='_blank' style={{ textDecoration: 'none', color: '4FA586' }}>购买地址：51BuyGPT</a>
                    </Button>
                </Stack>

                {
                    sponsorBanners.length > 0 && (
                        <Divider sx={{ margin: '10px 0 5px 0', opacity: 0.8 }}>
                            {t('Special thanks to the following sponsors:')}
                        </Divider>
                    )
                }
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                            m: 1,
                        },
                        justifyContent: 'center',
                        opacity: 0.8,
                    }}
                >
                    {
                        sponsorBanners.map((item) => {
                            return (
                                <Paper key={item.name} elevation={1} sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    autoflowY: 'auto',
                                    width: '100%',
                                    height: '128px',
                                }}>
                                    {
                                        item.type === 'picture' ? (
                                            <>
                                                <a href={item.link} target='_blank'>
                                                    <img style={{ maxWidth: '90%', maxHeight: '100px' }} src={item.pictureUrl} />
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <a href={item.link} target='_blank'>
                                                    <img style={{ maxWidth: '140px' }} src={item.pictureUrl} />
                                                </a>
                                                <a href={item.link} target='_blank'>
                                                    <b>{item.title}</b>
                                                </a>
                                                <a href={item.link} target='_blank'>
                                                    <span>{item.description}</span>
                                                </a>
                                            </>
                                        )
                                    }
                                </Paper>
                            )
                        })
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close}>{t('close')}</Button>
            </DialogActions>
        </Dialog>
    );
}
