export default {
    RBody: {
        children: {
            PBody: {
                options: {
                    scale: [3, 4, 1],
                },
            },
            RHead: {
                options: {
                    position: [0, 2, 0],
                },
                children: {
                    PHead: {
                        options: {
                            position: [0, 0.5, 0],
                        },
                    },
                }
            },
            RArmL: {
                options: {
                    position: [-1.5, 1.5, 0],
                },
                children: {
                    PArmL: {
                        options: {
                            position: [-0.3, -1.5, 0],
                            scale: [0.6, 3, 0.6],
                        },
                    },
                },
            },
            RArmR: {
                options: {
                    position: [1.5, 1.5, 0],
                },
                children: {
                    PArmR: {
                        options: {
                            position: [0.3, -1.5, 0],
                            scale: [0.6, 3, 0.6],
                        },
                    },
                },
            },
            RLegL: {
                options: {
                    position: [-0.5, -2, 0],
                },
                children: {
                    PLegL: {
                        options: {
                            position: [0, -1, 0],
                            scale: [0.6, 2, 0.6],
                        },
                    },
                },
            },
            RLegR: {
                options: {
                    position: [0.5, -2, 0],
                },
                children: {
                    PLegR: {
                        options: {
                            position: [0, -1, 0],
                            scale: [0.6, 2, 0.6],
                        },
                    },
                },
            },
        }
    }
}
