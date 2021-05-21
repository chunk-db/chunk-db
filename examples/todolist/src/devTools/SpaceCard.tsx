import { ISpace } from '@chunk-db/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
});

interface IProps {
    space: ISpace;
}

export function SpaceCard({ space }: IProps) {
    const classes = useStyles();

    if (!space)
        return (
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Skeleton animation="wave"
                                  variant="circle"
                                  width={40} height={40} />
                    }
                    title={<Skeleton animation="wave"
                                     height={20} width="40%" />}
                    subheader={<Skeleton animation="wave"
                                         height={20} width="50%" />}
                />
                <CardContent>
                    <Typography gutterBottom>
                        Description: <Skeleton animation="wave"
                                               component="span"
                                               height={24} width="100px"
                    />
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table
                            size="small"
                            stickyHeader
                            aria-label="a dense table"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ref</TableCell>
                                    <TableCell align="right">Chunk</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            <Skeleton animation="wave"
                                                      component="span"
                                                      height={20} width="40%"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Skeleton animation="wave"
                                                      component="span"
                                                      height={20} width="90%"
                                            />
                                        </TableCell>
                                    </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        );

    const refs = Object.keys(space?.refs)
                       .map(ref => ({ ref, chunk: space.refs[ref] }));

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        S
                    </Avatar>
                }
                title={space.name}
                subheader={space.id}
            />
            <CardContent>
                <Typography gutterBottom
                            component="div">
                    Description:
                    {space.description
                        ? <Box>{space.description}</Box>
                        : <Box><i>(empty)</i></Box>
                    }
                </Typography>

                <TableContainer component={Paper}>
                    <Table
                        size="small"
                        stickyHeader
                        aria-label="a dense table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Ref</TableCell>
                                <TableCell align="right">Chunk</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {refs.map((row) => (
                                <TableRow key={row.ref}>
                                    <TableCell component="th" scope="row">
                                        {row.ref}
                                    </TableCell>
                                    <TableCell
                                        align="right">{row.chunk}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
