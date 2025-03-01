import * as Matter from "matter-js";

const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

// Physics configuration
const physicsConfig = {
    airFriction: 0.05,
    restitution: 0.7,
    density: 0.001,
};

// Initialize physics engine
export function createPhysicsEngine(container) {
    try {
        // Create engine
        const engine = Engine.create({
            gravity: {
                x: 0,
                y: 0.001, // Very light gravity for floating feel
            },
        });

        // Create renderer
        const render = Render.create({
            element: container,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: "transparent",
            },
        });
        render.options.pixelRatio = 1; // reduce rendering load for performance

        // Create walls to keep quotes within viewport
        const walls = [
            Bodies.rectangle(
                window.innerWidth / 2,
                -10,
                window.innerWidth,
                20,
                {
                    isStatic: true,
                    render: { fillStyle: "transparent" },
                }
            ), // Top
            Bodies.rectangle(
                window.innerWidth / 2,
                window.innerHeight + 10,
                window.innerWidth,
                20,
                {
                    isStatic: true,
                    render: { fillStyle: "transparent" },
                }
            ), // Bottom
            Bodies.rectangle(
                -10,
                window.innerHeight / 2,
                20,
                window.innerHeight,
                {
                    isStatic: true,
                    render: { fillStyle: "transparent" },
                }
            ), // Left
            Bodies.rectangle(
                window.innerWidth + 10,
                window.innerHeight / 2,
                20,
                window.innerHeight,
                {
                    isStatic: true,
                    render: { fillStyle: "transparent" },
                }
            ), // Right
        ];

        // Add walls to world
        World.add(engine.world, walls);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false,
                },
            },
        });

        World.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Handle window resize
        window.addEventListener("resize", () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
            walls.forEach((wall) => World.remove(engine.world, wall));
            World.add(engine.world, [
                Bodies.rectangle(
                    window.innerWidth / 2,
                    -10,
                    window.innerWidth,
                    20,
                    {
                        isStatic: true,
                        render: { fillStyle: "transparent" },
                    }
                ),
                Bodies.rectangle(
                    window.innerWidth / 2,
                    window.innerHeight + 10,
                    window.innerWidth,
                    20,
                    {
                        isStatic: true,
                        render: { fillStyle: "transparent" },
                    }
                ),
                Bodies.rectangle(
                    -10,
                    window.innerHeight / 2,
                    20,
                    window.innerHeight,
                    {
                        isStatic: true,
                        render: { fillStyle: "transparent" },
                    }
                ),
                Bodies.rectangle(
                    window.innerWidth + 10,
                    window.innerHeight / 2,
                    20,
                    window.innerHeight,
                    {
                        isStatic: true,
                        render: { fillStyle: "transparent" },
                    }
                ),
            ]);
        });

        return {
            engine,
            render,
            mouseConstraint,
        };
    } catch (error) {
        console.error("Error creating physics engine:", error);
        throw error;
    }
}

// Start the physics engine and renderer
export function startPhysicsEngine(engine, render) {
    try {
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);
        Render.run(render);

        // Add an event listener to remove non-static bodies that go above the viewport
        Matter.Events.on(engine, "afterUpdate", () => {
            engine.world.bodies.forEach((body) => {
                if (!body.isStatic && body.position.y < -50) {
                    // Remove body if it goes off the top
                    World.remove(engine.world, body);
                }
            });
        });
    } catch (error) {
        console.error("Error starting physics engine:", error);
        throw error;
    }
}

// Create a physics body for a quote card
export function createQuoteBody(x, y, width, height) {
    try {
        return Bodies.rectangle(x, y, width, height, {
            ...physicsConfig,
            render: {
                fillStyle: "transparent",
                strokeStyle: "transparent",
                lineWidth: 0,
            },
        });
    } catch (error) {
        console.error("Error creating quote body:", error);
        throw error;
    }
}

// Add a body to the physics world
export function addToWorld(engine, body) {
    try {
        let attempts = 0;
        let overlap = true;
        // Try repositioning body a few times if it overlaps with any existing non-static bodies
        while (overlap && attempts < 10) {
            overlap = false;
            for (const existing of engine.world.bodies) {
                if (!existing.isStatic) {
                    const collision = Matter.SAT.collides(existing, body);
                    if (collision.collided) {
                        overlap = true;
                        break;
                    }
                }
            }
            if (overlap) {
                // Shift the body horizontally by 10 pixels each attempt
                Matter.Body.translate(body, { x: 10, y: 0 });
            }
            attempts++;
        }
        World.add(engine.world, body);
    } catch (error) {
        console.error("Error adding body to world:", error);
        throw error;
    }
}

// Remove a body from the physics world
export function removeFromWorld(engine, body) {
    try {
        World.remove(engine.world, body);
    } catch (error) {
        console.error("Error removing body from world:", error);
        throw error;
    }
}
