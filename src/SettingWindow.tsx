import React from 'react';
import {
    Button, Alert, Chip,
    Dialog, DialogContent, DialogActions, DialogTitle, TextField,
    FormGroup, FormControlLabel, Switch, Select, MenuItem, FormControl, InputLabel, Slider, Typography, Box,
} from '@mui/material';
import { Settings } from './types'
import { getDefaultSettings } from './store'
import ThemeChangeButton from './theme/ThemeChangeIcon';
import { ThemeMode } from './theme/index';
import { useThemeSwicher } from './theme/ThemeSwitcher';
import { styled } from '@mui/material/styles';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { Trans, useTranslation } from 'react-i18next'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';

const { useEffect } = React
const models: string[] = ['gpt-3.5-turbo', 'gpt-4'];
const languages: string[] = ['en', 'zh-Hans', 'zh-Hant','jp'];
const languageMap: { [key: string]: string } = {
    'en': 'English',
    'zh-Hans': '简体中文',
    'zh-Hant': '繁體中文',
    'jp':'日本語'
};
interface Props {
    open: boolean
    settings: Settings
    close(): void
    save(settings: Settings): void
}

export default function SettingWindow(props: Props) {
    const { t } = useTranslation()
    const [settingsEdit, setSettingsEdit] = React.useState<Settings>(props.settings);
    const handleRepliesTokensSliderChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (newValue === 8192) {
            setSettingsEdit({ ...settingsEdit, maxTokens: 'inf' });
        } else {
            setSettingsEdit({ ...settingsEdit, maxTokens: newValue.toString() });
        }
    };
    const handleMaxContextSliderChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (newValue === 8192) {
            setSettingsEdit({ ...settingsEdit, maxContextSize: 'inf' });
        } else {
            setSettingsEdit({ ...settingsEdit, maxContextSize: newValue.toString() });
        }
    };
    const handleTemperatureChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (typeof newValue === 'number') {
            setSettingsEdit({ ...settingsEdit, temperature: newValue });
        } else {
            setSettingsEdit({ ...settingsEdit, temperature: newValue[activeThumb] });
        }
    };
    const handleRepliesTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === 'inf') {
            setSettingsEdit({ ...settingsEdit, maxTokens: 'inf' });
        } else {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0) {
                if (numValue > 8192) {
                    setSettingsEdit({ ...settingsEdit, maxTokens: 'inf' });
                    return;
                }
                setSettingsEdit({ ...settingsEdit, maxTokens: value });
            }
        }
    };
    const handleMaxContextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === 'inf') {
            setSettingsEdit({ ...settingsEdit, maxContextSize: 'inf' });
        } else {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0) {
                if (numValue > 8192) {
                    setSettingsEdit({ ...settingsEdit, maxContextSize: 'inf' });
                    return;
                }
                setSettingsEdit({ ...settingsEdit, maxContextSize: value });
            }
        }
    };

    const [, { setMode }] = useThemeSwicher();
    useEffect(() => {
        setSettingsEdit(props.settings)
    }, [props.settings])

    const onCancel = () => {
        props.close()
        setSettingsEdit(props.settings)

        // need to restore the previous theme
        setMode(props.settings.theme ?? ThemeMode.System);
    }

    // preview theme
    const changeModeWithPreview = (newMode: ThemeMode) => {
        setSettingsEdit({ ...settingsEdit, theme: newMode });
        setMode(newMode);
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <Dialog open={props.open} onClose={onCancel} fullWidth >
            <DialogTitle>{t('settings')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('openai api key')}
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={settingsEdit.openaiKey}
                    onChange={(e) => setSettingsEdit({ ...settingsEdit, openaiKey: e.target.value.trim() })}
                />
                <TextField
                        margin="dense"
                        label={t('api host')}
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={settingsEdit.apiHost}
                        onChange={(e) => setSettingsEdit({ ...settingsEdit, apiHost: e.target.value.trim() })}
                />
                <Accordion>
                    <AccordionSummary
                        aria-controls="panel1a-content"
                    >
                        <Typography>{t('model')} & {t('token')} </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        
                        <FormControl fullWidth variant="outlined" margin="dense">
                            <InputLabel htmlFor="model-select">{t('model')}</InputLabel>
                            <Select
                                label="Model"
                                id="model-select"
                                value={settingsEdit.model}
                                onChange={(e) => setSettingsEdit({ ...settingsEdit, model: e.target.value })}>
                                {models.map((model) => (
                                    <MenuItem key={model} value={model}>
                                        {model}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormGroup>
                            <FormControlLabel control={<Switch />}
                                label={t('show model name')}
                                checked={settingsEdit.showModelName}
                                onChange={(e, checked) => setSettingsEdit({ ...settingsEdit, showModelName: checked })}
                            />
                        </FormGroup>

                    </AccordionDetails>
                </Accordion>
                
                <FormControl sx={{ flexDirection: 'row', alignItems: 'center', paddingTop: 1, paddingBottom: 1 }}>
                    <span style={{ marginRight: 10 }}>{t('theme')}</span>
                    <ThemeChangeButton value={settingsEdit.theme} onChange={theme => changeModeWithPreview(theme)} />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel>Font Size</InputLabel>
                    <Select
                        labelId="select-font-size"
                        value={settingsEdit.fontSize}
                        label="FontSize"
                        onChange={(event) => {
                            setSettingsEdit({ ...settingsEdit, fontSize: event.target.value as number })
                        }}
                    >
                        {
                            [12, 13, 14, 15, 16, 17, 18].map((size) => (
                                <MenuItem key={size} value={size}>{size}px</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormGroup>
                    <FormControlLabel control={<Switch />}
                        label={t('show word count')}
                        checked={settingsEdit.showWordCount}
                        onChange={(e, checked) => setSettingsEdit({ ...settingsEdit, showWordCount: checked })}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel control={<Switch />}
                        label={t('show estimated token count')}
                        checked={settingsEdit.showTokenCount}
                        onChange={(e, checked) => setSettingsEdit({ ...settingsEdit, showTokenCount: checked })}
                    />
                </FormGroup>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{t('cancel')}</Button>
                <Button onClick={() => props.save(settingsEdit)}>{t('save')}</Button>
            </DialogActions>
        </Dialog>
    );
}

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
