export default {
    RBody: {
        children: {
            PBody: {
                options: {
                    position: [0, 1.5, 0],
                    scale: [1.5, 1, 1],
                },
            },
            RHead: {
                options: {
                    position: [0.75, 1.5, 0],
                },
                children: {
                    PHead: {
                        options: {
                            position: [0.35, 0, 0],
                            scale: [0.7, 0.7, 1.2],
                        },
                    },
                    PMouth: {
                        options: {
                            position: [0.85, -0.2, 0],
                            scale: [0.3, 0.2, 0.5],
                        }
                    },
                },
            },
            RTail : {
                options: {
                    position: [-0.75, 1.5, 0],
                },
                children: {
                    PTail: {
                        options: {
                            position: [-0.6, 0, 0],
                            scale: [1.2, 0.6, 0.6],
                        },
                    },
                },
            },
            RLegFR: {
                options: {
                    position: [0.5, 1, -0.25],
                },
                children: {
                    PLegFR: {
                        options: {
                            position: [0, -0.5, 0],
                            scale: [0.3, 1, 0.3],
                        },
                    },
                },
            },
            RLegFL: {
                options: {
                    position: [0.5, 1, 0.25],
                },
                children: {
                    PLegFL: {
                        options: {
                            position: [0, -0.5, 0],
                            scale: [0.3, 1, 0.3],
                        },
                    },
                },
            },
            RLegBR: {
                options: {
                    position: [-0.5, 1, 0.25],
                },
                children: {
                    PLegBR: {
                        options: {
                            position: [0, -0.5, 0],
                            scale: [0.3, 1, 0.3],
                        },
                    },
                },
            },
            RLegBL: {
                options: {
                    position: [-0.5, 1, -0.25],
                },
                children: {
                    PLegBL: {
                        options: {
                            position: [0, -0.5, 0],
                            scale: [0.3, 1, 0.3],
                        },
                    },
                },
            },
        },
    },
};