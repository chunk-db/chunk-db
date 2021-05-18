import { ISpace } from '@chunk-db/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

interface IProps {
    space: ISpace;
}

export function SpaceCard({ space }: IProps) {
    if (!space)
        return (
            <Card>
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
                                               height={26} width="100px"
                    />
                    </Typography>
                    <Table
                        size="small"
                        stickyHeader
                        aria-label="a dense table"
                        component={Paper}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Ref</TableCell>
                                <TableCell align="right">Chunk</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[0, 1, 2].map((row) => (
                                <TableRow key={row}>
                                    <TableCell component="th" scope="row">
                                        <Skeleton animation="wave"
                                                  component="span"
                                                  height={26} width="40%"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Skeleton animation="wave"
                                                  component="span"
                                                  height={26} width="90%"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );

    const refs = Object.keys(space?.refs)
                       .map(ref => ({ ref, chunk: space.refs[ref] }));

    return (
        <Card>
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
                <Table
                    size="small"
                    stickyHeader
                    aria-label="a dense table"
                    component={Paper}
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
                                <TableCell align="right">{row.chunk}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
