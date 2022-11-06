import { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import PocketService from '../../services/pocketService';
import './ProductCard.css';

export default function ProductCard(props: any) {
    const flipLimit = props.signFlipLimit > props.data.value ? true : false;
    const flipColor = flipLimit ? 'success.dark' : '';
    const [expanded, setExpanded] = useState<boolean>();
    const click = () => {
        props.onClick(props.data.name);
    }
    const handleChange = () => {
        if(props.expand){
            setExpanded(props.expandMatch === props.data.name);
        }
    }
    return (
        <Accordion onClick={click} expanded={expanded} onChange={handleChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        borderRadius: 1,
                        p: 2,
                        minWidth: 300,
                    }}>
                    <Box sx={{ color: 'text.secondary' }}>{props.data.name}</Box>
                    <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                        <Box
                            component={flipLimit ? TrendingUp : TrendingDown}
                            sx={{ color: flipColor, fontSize: 16, verticalAlign: 'sub' }}
                        />
                        <Box
                            sx={{
                                color: 'success.secondary',
                                display: 'inline',
                                fontWeight: 'medium',
                                mx: 0.5,
                            }}>
                            {props.data.value}
                        </Box>
                        <Box sx={{ color: 'text.secondary', display: 'inline', fontSize: 12 }}>
                            | {props.data.priceDesc}
                        </Box>
                    </Box>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    <Typography>
                        <a href={props.data.url}> See on Hero Bullion</a>
                    </Typography>
                    <Chip label={props.data.inStock ? 'In Stock' : 'Unavailable'}
                        icon={props.data.inStock ? <TagFacesIcon /> : <ErrorOutline />}
                        color={props.data.inStock ? 'success' : 'primary'} />
                </Box>
            </AccordionDetails>
        </Accordion>

    );
}