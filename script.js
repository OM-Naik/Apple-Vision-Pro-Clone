var loader = document.getElementById("loader");
window.addEventListener("load", function () {
    loader.style.display = "none";
})

function loco() {
    gsap.registerPlugin(ScrollTrigger);

    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true
    });
    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });


    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();

}
loco()



// ------------------------------------------------ * For laptop/pc screens * ------------------------------------------------

if (window.innerWidth > 768) {

    gsap.to("#page", {
        scrollTrigger: {
            trigger: `#page`,
            start: `top top`,
            end: `bottom top`,
            scroller: `#main`,
            pin: true,
            // markers: true
        },
    });


    var om = gsap.timeline({
        scrollTrigger: {
            start: 'top top',
            end: '0.1% top',
            scrub: 1,
            scroller: '#main',
            // markers: true
        },
    });
    om.to("#header1", {
        opacity: 0,
        zIndex: -1
    });
    om.to("#page>nav", {
        height: 65,
        delay: 1,
        duration: 0.5,
    });
    om.to('#header2', {
        position: 'fixed',
    });



    gsap.set("#page>video", {
        scale: 1,
        width: "100%",
        height: "110%",
        objectFit: "cover",
    });
    // Animation to change video length and start playing
    gsap.to("#page>video", {
        width: "70%", // Target scale when the animation completes
        scrollTrigger: {
            trigger: `#page>video`,
            start: `0.1% top`,
            end: `bottom top`,
            scroller: `#main`,
            // markers: true,
            onUpdate: (self) => {
                // Adjust the width based on the scroll position (reverse)
                const newWidth = gsap.utils.mapRange(0, 1, 70, 50, self.progress);
                gsap.set("#page>video", { width: `${newWidth}%` });
            },
        },
        onStart: () => {
            document.querySelector("#page>video").play();

            // Add animation to hide #page-bottom when video starts playing
            gsap.to("#page-bottom", {
                opacity: 0,
                duration: 0.5 // Adjust the duration as needed
            });



            // gsap.to('#header1', { y: '-10%', duration: 0.1 });
        },

        // onComplete: () => {

        //     // Add animation to show #page-bottom when video ends
        //     gsap.to("#page-bottom", {
        //         opacity: 1,
        //         delay: 2 // Adjust the duration as needed
        //     });

        //     gsap.to('#header1', { y: '0', duration: 4 });
        // }
    });


    // var tl = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: `#page1`,
    //         start: `top top`,
    //         scrub: 1,
    //         scroller: `#main`,
    //         pin: true
    //     },
    // })
    // tl.to("#page1>h1", {
    //     top: `-10%`,
    //     opacity: 0,
    // })


    // var tl1 = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: `#page2`,
    //         start: `top top`,
    //         scrub: 1,
    //         scroller: `#main`,
    //         pin: true
    //     },
    // })
    // tl1.to("#page2>h1", {
    //     top: `-10%`,
    //     opacity: 0,
    // })

    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#page1',
            start: 'top top',
            scrub: 1,
            scroller: '#main',
            pin: true,
        },
    });
    tl.to("#page1>#center-page-1text>h1", {
        top: '-10%',
        opacity: 0,
    });




    var tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: '#page2',
            start: 'top top',
            scrub: 1,
            scroller: '#main',
            pin: true,
        },
    });
    tl1.to("#page2>#center-page-2text>h1", {
        top: '-10%',
        opacity: 0,
    });


    function canvas() {
        const canvas = document.querySelector("#page5>canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions
        function setCanvasDimensions() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener("resize", setCanvasDimensions);

        // Initial canvas dimensions setup
        setCanvasDimensions();

        function files(index) {
            var data = `
         .//Img/Screenshot 2024-01-10 220226.png
         .//Img/Screenshot 2024-01-10 220636.png
         .//Img/Screenshot 2024-01-10 220802.png
         .//Img/Screenshot 2024-01-10 220845.png
         .//Img/Screenshot 2024-01-10 220929.png
      `;
            return data.split("\n")[index];
        }
        // Load and animate images
        const frameCount = 6;
        const images = [];
        const imageSeq = {
            frame: 1,
        };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = files(i);
            images.push(img);
        }

        gsap.to(imageSeq, {
            frame: frameCount - 1,
            snap: "frame",
            ease: `none`,
            scrollTrigger: {
                scrub: 1, // Adjust the scrub value
                trigger: `#page5`,
                start: `15% top`,
                end: `25% top`,
                scroller: `#main`,
            },
            onUpdate: render,
        });

        images[1].onload = render;

        function render() {
            scaleImage(images[imageSeq.frame], context);
        }

        function scaleImage(img, ctx) {
            var canvas = ctx.canvas;
            var hRatio = canvas.width / img.width;
            var vRatio = canvas.height / img.height;
            var ratio = Math.min(hRatio, vRatio);
            var centerShift_x = (canvas.width - img.width * ratio) / 2;
            var centerShift_y = (canvas.height - img.height * ratio) / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                centerShift_x,
                centerShift_y,
                img.width * ratio,
                img.height * ratio
            );
        }

        // ScrollTrigger for canvas pinning
        ScrollTrigger.create({
            trigger: "#page5",
            scrub: 1, // Adjust the scrub value
            pin: true,
            scroller: `#main`,
            start: `15% top`,
            end: `30% top`,
        });
    }

    canvas();





    var tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: `#page6`,
            start: `top top`,
            end: `70% top`,
            scrub: 1,
            scroller: `#main`,
            pin: true
        },
    })
    tl2.to("#page6>#center-page", {
        delay: 0.2,
        top: `-50%`,
    })
    tl2.to("#page6>video", {
        width: `90%`,
    })



    function canvas1() {
        const canvas = document.querySelector("#page15>canvas");
        const context = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        window.addEventListener("resize", function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        });

        function files(index) {
            var data = `
             .//Img/canvas/0000.jpg.jpeg
             .//Img/canvas/0001.jpg.jpeg
             .//Img/canvas/0002.jpg.jpeg
             .//Img/canvas/0003.jpg.jpeg
             .//Img/canvas/0004.jpg.jpeg
             .//Img/canvas/0005.jpg.jpeg
             .//Img/canvas/0006.jpg.jpeg
             .//Img/canvas/0007.jpg.jpeg
             .//Img/canvas/0008.jpg.jpeg
             .//Img/canvas/0009.jpg.jpeg
             .//Img/canvas/0010.jpg.jpeg
             .//Img/canvas/0011.jpg.jpeg
             .//Img/canvas/0012.jpg.jpeg
             .//Img/canvas/0013.jpg.jpeg
             .//Img/canvas/0014.jpg.jpeg
             .//Img/canvas/0015.jpg.jpeg
             .//Img/canvas/0016.jpg.jpeg
             .//Img/canvas/0017.jpg.jpeg
             .//Img/canvas/0018.jpg.jpeg
             .//Img/canvas/0019.jpg.jpeg
             .//Img/canvas/0020.jpg.jpeg
             .//Img/canvas/0021.jpg.jpeg
             .//Img/canvas/0022.jpg.jpeg
             .//Img/canvas/0023.jpg.jpeg
             .//Img/canvas/0024.jpg.jpeg
             .//Img/canvas/0025.jpg.jpeg
             .//Img/canvas/0026.jpg.jpeg
             .//Img/canvas/0027.jpg.jpeg
             .//Img/canvas/0028.jpg.jpeg
             .//Img/canvas/0029.jpg.jpeg
             .//Img/canvas/0030.jpg.jpeg
             .//Img/canvas/0031.jpg.jpeg
             .//Img/canvas/0032.jpg.jpeg
             .//Img/canvas/0033.jpg.jpeg
             .//Img/canvas/0034.jpg.jpeg
             .//Img/canvas/0035.jpg.jpeg
             .//Img/canvas/0036.jpg.jpeg
             .//Img/canvas/0037.jpg.jpeg
             .//Img/canvas/0038.jpg.jpeg
             .//Img/canvas/0039.jpg.jpeg
             .//Img/canvas/0040.jpg.jpeg
             .//Img/canvas/0041.jpg.jpeg
             .//Img/canvas/0042.jpg.jpeg
             .//Img/canvas/0043.jpg.jpeg
             .//Img/canvas/0044.jpg.jpeg
             .//Img/canvas/0045.jpg.jpeg
             .//Img/canvas/0046.jpg.jpeg
             .//Img/canvas/0047.jpg.jpeg
             .//Img/canvas/0048.jpg.jpeg
             .//Img/canvas/0049.jpg.jpeg
             .//Img/canvas/0050.jpg.jpeg
             .//Img/canvas/0051.jpg.jpeg
             .//Img/canvas/0052.jpg.jpeg
             .//Img/canvas/0053.jpg.jpeg
             .//Img/canvas/0054.jpg.jpeg
             .//Img/canvas/0055.jpg.jpeg
             .//Img/canvas/0056.jpg.jpeg
             .//Img/canvas/0057.jpg.jpeg
             .//Img/canvas/0058.jpg.jpeg
             .//Img/canvas/0059.jpg.jpeg
             .//Img/canvas/0060.jpg.jpeg
             .//Img/canvas/0061.jpg.jpeg
             .//Img/canvas/0062.jpg.jpeg
             .//Img/canvas/0063.jpg.jpeg
             .//Img/canvas/0064.jpg.jpeg
             .//Img/canvas/0065.jpg.jpeg
             .//Img/canvas/0066.jpg.jpeg
             .//Img/canvas/0067.jpg.jpeg
             .//Img/canvas/0068.jpg.jpeg
             .//Img/canvas/0069.jpg.jpeg
             .//Img/canvas/0070.jpg.jpeg
             .//Img/canvas/0071.jpg.jpeg
             .//Img/canvas/0072.jpg.jpeg
             .//Img/canvas/0073.jpg.jpeg
             .//Img/canvas/0074.jpg.jpeg
             .//Img/canvas/0075.jpg.jpeg
             .//Img/canvas/0076.jpg.jpeg
             .//Img/canvas/0077.jpg.jpeg
             .//Img/canvas/0078.jpg.jpeg
             .//Img/canvas/0079.jpg.jpeg
             .//Img/canvas/0080.jpg.jpeg
             .//Img/canvas/0081.jpg.jpeg
             .//Img/canvas/0082.jpg.jpeg
             .//Img/canvas/0083.jpg.jpeg
             .//Img/canvas/0084.jpg.jpeg
             .//Img/canvas/0085.jpg.jpeg
             .//Img/canvas/0086.jpg.jpeg
             .//Img/canvas/0087.jpg.jpeg
             .//Img/canvas/0088.jpg.jpeg
             .//Img/canvas/0089.jpg.jpeg
             .//Img/canvas/0090.jpg.jpeg
             .//Img/canvas/0091.jpg.jpeg
             .//Img/canvas/0092.jpg.jpeg
             .//Img/canvas/0093.jpg.jpeg
             .//Img/canvas/0094.jpg.jpeg
             .//Img/canvas/0095.jpg.jpeg
             .//Img/canvas/0096.jpg.jpeg
             .//Img/canvas/0097.jpg.jpeg
             .//Img/canvas/0098.jpg.jpeg
             .//Img/canvas/0099.jpg.jpeg
             .//Img/canvas/0100.jpg.jpeg
             .//Img/canvas/0101.jpg.jpeg
             .//Img/canvas/0102.jpg.jpeg
             .//Img/canvas/0103.jpg.jpeg
             .//Img/canvas/0104.jpg.jpeg
             .//Img/canvas/0105.jpg.jpeg
             .//Img/canvas/0106.jpg.jpeg
             .//Img/canvas/0107.jpg.jpeg
             .//Img/canvas/0108.jpg.jpeg
             .//Img/canvas/0109.jpg.jpeg
             .//Img/canvas/0110.jpg.jpeg
             .//Img/canvas/0111.jpg.jpeg
             .//Img/canvas/0112.jpg.jpeg
             .//Img/canvas/0113.jpg.jpeg
             .//Img/canvas/0114.jpg.jpeg
             .//Img/canvas/0115.jpg.jpeg
             .//Img/canvas/0116.jpg.jpeg
             .//Img/canvas/0117.jpg.jpeg
             .//Img/canvas/0118.jpg.jpeg
             .//Img/canvas/0119.jpg.jpeg
             .//Img/canvas/0120.jpg.jpeg
             .//Img/canvas/0121.jpg.jpeg
             .//Img/canvas/0122.jpg.jpeg
             .//Img/canvas/0123.jpg.jpeg
             .//Img/canvas/0124.jpg.jpeg
             .//Img/canvas/0125.jpg.jpeg
             .//Img/canvas/0126.jpg.jpeg
             .//Img/canvas/0127.jpg.jpeg
             .//Img/canvas/0128.jpg.jpeg
             .//Img/canvas/0129.jpg.jpeg
             .//Img/canvas/0130.jpg.jpeg
             .//Img/canvas/0131.jpg.jpeg
             .//Img/canvas/0132.jpg.jpeg
             .//Img/canvas/0133.jpg.jpeg
             .//Img/canvas/0134.jpg.jpeg
             .//Img/canvas/0135.jpg.jpeg
             .//Img/canvas/0136.jpg.jpeg
             .//Img/canvas/0137.jpg.jpeg
             .//Img/canvas/0138.jpg.jpeg
             .//Img/canvas/0139.jpg.jpeg
             .//Img/canvas/0140.jpg.jpeg
             .//Img/canvas/0141.jpg.jpeg
             .//Img/canvas/0142.jpg.jpeg
             .//Img/canvas/0143.jpg.jpeg
             .//Img/canvas/0144.jpg.jpeg
             .//Img/canvas/0145.jpg.jpeg
             .//Img/canvas/0146.jpg.jpeg
             .//Img/canvas/0147.jpg.jpeg
             .//Img/canvas/0148.jpg.jpeg
             .//Img/canvas/0149.jpg.jpeg
             .//Img/canvas/0150.jpg.jpeg
             .//Img/canvas/0151.jpg.jpeg
             .//Img/canvas/0152.jpg.jpeg
             .//Img/canvas/0153.jpg.jpeg
             .//Img/canvas/0154.jpg.jpeg
             .//Img/canvas/0155.jpg.jpeg
             .//Img/canvas/0156.jpg.jpeg
             .//Img/canvas/0157.jpg.jpeg
             .//Img/canvas/0158.jpg.jpeg
             .//Img/canvas/0159.jpg.jpeg
             .//Img/canvas/0160.jpg.jpeg
             .//Img/canvas/0161.jpg.jpeg
             .//Img/canvas/0162.jpg.jpeg
             .//Img/canvas/0163.jpg.jpeg
             .//Img/canvas/0164.jpg.jpeg
             .//Img/canvas/0165.jpg.jpeg
             .//Img/canvas/0166.jpg.jpeg
             .//Img/canvas/0167.jpg.jpeg
             .//Img/canvas/0168.jpg.jpeg
             .//Img/canvas/0169.jpg.jpeg
             .//Img/canvas/0170.jpg.jpeg
             .//Img/canvas/0171.jpg.jpeg
             .//Img/canvas/0172.jpg.jpeg
             .//Img/canvas/0173.jpg.jpeg
             .//Img/canvas/0174.jpg.jpeg
             .//Img/canvas/0175.jpg.jpeg
             .//Img/canvas/0176.jpg.jpeg
             .//Img/canvas/0177.jpg.jpeg
             .//Img/canvas/0178.jpg.jpeg
             .//Img/canvas/0179.jpg.jpeg
             .//Img/canvas/0180.jpg.jpeg
             .//Img/canvas/0181.jpg.jpeg
             .//Img/canvas/0182.jpg.jpeg
             .//Img/canvas/0183.jpg.jpeg
             .//Img/canvas/0184.jpg.jpeg
             .//Img/canvas/0185.jpg.jpeg
             .//Img/canvas/0186.jpg.jpeg
             .//Img/canvas/0187.jpg.jpeg
             .//Img/canvas/0188.jpg.jpeg
             .//Img/canvas/0189.jpg.jpeg
             .//Img/canvas/0190.jpg.jpeg
             .//Img/canvas/0191.jpg.jpeg
             .//Img/canvas/0192.jpg.jpeg
             .//Img/canvas/0193.jpg.jpeg
             .//Img/canvas/0194.jpg.jpeg
             .//Img/canvas/0195.jpg.jpeg
             .//Img/canvas/0196.jpg.jpeg
             .//Img/canvas/0197.jpg.jpeg
             .//Img/canvas/0198.jpg.jpeg
         `;
            return data.split("\n")[index];
        }

        const frameCount = 199;

        const images = [];
        const imageSeq = {
            frame: 1,
        };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = files(i);
            images.push(img);
        }

        gsap.to(imageSeq, {
            frame: frameCount - 1,
            snap: "frame",
            ease: `none`,
            scrollTrigger: {
                scrub: 1,
                trigger: `#page15>canvas`,
                //   set start end according to preference
                start: `top top`,
                end: `600% top`,
                scroller: `#main`,
            },
            onUpdate: render,
        });

        images[1].onload = render;

        function render() {
            scaleImage(images[imageSeq.frame], context);
        }

        function scaleImage(img, ctx) {
            var canvas = ctx.canvas;
            var hRatio = canvas.width / img.width;
            var vRatio = canvas.height / img.height;
            var ratio = Math.min(hRatio, vRatio);
            var centerShift_x = (canvas.width - img.width * ratio) / 2;
            var centerShift_y = (canvas.height - img.height * ratio) / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                centerShift_x,
                centerShift_y,
                img.width * ratio,
                img.height * ratio
            );
        }
        ScrollTrigger.create({

            trigger: "#page15>canvas",
            pin: true,
            // markers:true,
            scroller: `#main`,
            //   set start end according to preference
            start: `top top`,
            end: `600% top`,
        });
    }

    canvas1()




    // var tl3 = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: `#page31`,
    //         start: `15% top`,
    //         end: `25% top`,
    //         scrub: 1,
    //         scroller: `#main`,
    //         pin: true
    //     },
    // })
    // tl3.to("#page31>.center-page31", {
    //     top: `-50%`,
    //     opacity: 0,
    // })



    // function canvas1() {
    //     const canvas = document.querySelector("#page31>canvas");
    //     const context = canvas.getContext("2d");

    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;


    //     window.addEventListener("resize", function () {
    //         canvas.width = window.innerWidth;
    //         canvas.height = window.innerHeight;
    //         render();
    //     });

    //     function files(index) {
    //         var data = `
    //         .//vision/Screenshot 2024-01-08 215149.png
    //         .//vision/Screenshot 2024-01-08 215216.png
    //         .//vision/Screenshot 2024-01-08 215236.png
    //         .//vision/Screenshot 2024-01-08 215255.png
    //         .//vision/Screenshot 2024-01-08 215319.png
    //         .//vision/Screenshot 2024-01-08 215342.png
    //         .//vision/Screenshot 2024-01-08 215404.png
    //         .//vision/Screenshot 2024-01-08 215422.png
    //         .//vision/Screenshot 2024-01-08 215449.png
    //         .//vision/Screenshot 2024-01-08 215510.png
    //         .//vision/Screenshot 2024-01-08 215532.png
    //         .//vision/Screenshot 2024-01-08 215552.png
    //         .//vision/Screenshot 2024-01-08 215623.png
    //         .//vision/Screenshot 2024-01-08 215641.png
    //         .//vision/Screenshot 2024-01-08 215731.png
    //         .//vision/Screenshot 2024-01-08 215754.png
    //         .//vision/Screenshot 2024-01-08 215810.png
    //         .//vision/Screenshot 2024-01-08 215829.png
    //         .//vision/Screenshot 2024-01-08 215908.png
    //         .//vision/Screenshot 2024-01-08 215930.png
    //         .//vision/Screenshot 2024-01-08 215947.png
    //         .//vision/Screenshot 2024-01-08 220328.png
    //         .//vision/Screenshot 2024-01-08 220412.png
    //         .//vision/Screenshot 2024-01-09 005448.png
    //         .//vision/Screenshot 2024-01-09 005508.png
    //         .//vision/Screenshot 2024-01-09 005530.png
    //         .//vision/Screenshot 2024-01-09 005549.png
    //         .//vision/Screenshot 2024-01-09 005609.png
    //         .//vision/Screenshot 2024-01-09 005714.png
    //         .//vision/Screenshot 2024-01-09 005853.png
    //        `;
    //         return data.split("\n")[index];
    //     }

    //     const frameCount = 30;

    //     const images = [];
    //     const imageSeq = {
    //         frame: 1,
    //     };

    //     for (let i = 0; i < frameCount; i++) {
    //         const img = new Image();
    //         img.src = files(i);
    //         images.push(img);
    //     }

    //     gsap.to(imageSeq, {
    //         frame: frameCount - 1,
    //         snap: "frame",
    //         ease: `none`,
    //         scrollTrigger: {
    //             scrub: 1,
    //             trigger: `#page31`,
    //             //   set start end according to preference
    //             start: `15% top`,
    //             end: `40% top`,
    //             scroller: `#main`,
    //         },
    //         onUpdate: render,
    //     });

    //     images[1].onload = render;

    //     function render() {
    //         scaleImage(images[imageSeq.frame], context);
    //     }

    //     function scaleImage(img, ctx) {
    //         var canvas = ctx.canvas;
    //         var hRatio = canvas.width / img.width;
    //         var vRatio = canvas.height / img.height;
    //         var ratio = Math.min(hRatio, vRatio);
    //         var centerShift_x = (canvas.width - img.width * ratio) / 2;
    //         var centerShift_y = (canvas.height - img.height * ratio) / 2;
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         ctx.drawImage(
    //             img,
    //             0,
    //             0,
    //             img.width,
    //             img.height,
    //             centerShift_x,
    //             centerShift_y,
    //             img.width * ratio,
    //             img.height * ratio
    //         );
    //     }
    //     ScrollTrigger.create({

    //         trigger: "#page31>.canvas",
    //         scrub: 1,
    //         pin: true,
    //         // markers:true,
    //         scroller: `#main`,
    //         //   set start end according to preference
    //         start: `15% top`,
    //         end: `40% top`,
    //     });
    // }
    // canvas1();


    // Create a timeline for animations



    var mainTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: `#page31`,
            start: `15% top`,
            end: `35% top`,
            scrub: 1, // Adjust the scrub value
            scroller: `#main`,
            pin: true
        },
    });
    mainTimeline.to("#page31>.center-page31", {
        top: `-20%`,
        opacity: `0`,
        onComplete: canvas2,
    });


    function canvas2() {
        const canvas = document.querySelector("#page31>canvas");
        const context = canvas.getContext("2d");

        // Set canvas dimensions
        function setCanvasDimensions() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener("resize", setCanvasDimensions);

        // Initial canvas dimensions setup
        setCanvasDimensions();

        function files(index) {
            var data = `
        .//vision/Screenshot 2024-01-08 215149.png
        .//vision/Screenshot 2024-01-08 215216.png
        .//vision/Screenshot 2024-01-08 215236.png
        .//vision/Screenshot 2024-01-08 215255.png
        .//vision/Screenshot 2024-01-08 215319.png
        .//vision/Screenshot 2024-01-08 215342.png
        .//vision/Screenshot 2024-01-08 215404.png
        .//vision/Screenshot 2024-01-08 215422.png
        .//vision/Screenshot 2024-01-08 215449.png
        .//vision/Screenshot 2024-01-08 215510.png
        .//vision/Screenshot 2024-01-08 215532.png
        .//vision/Screenshot 2024-01-08 215552.png
        .//vision/Screenshot 2024-01-08 215623.png
        .//vision/Screenshot 2024-01-08 215641.png
        .//vision/Screenshot 2024-01-08 215731.png
        .//vision/Screenshot 2024-01-08 215754.png
        .//vision/Screenshot 2024-01-08 215810.png
        .//vision/Screenshot 2024-01-08 215829.png
        .//vision/Screenshot 2024-01-08 215908.png
        .//vision/Screenshot 2024-01-08 215930.png
        .//vision/Screenshot 2024-01-08 215947.png
        .//vision/Screenshot 2024-01-08 220328.png
        .//vision/Screenshot 2024-01-08 220412.png
        .//vision/Screenshot 2024-01-09 005448.png
        .//vision/Screenshot 2024-01-09 005508.png
        .//vision/Screenshot 2024-01-09 005530.png
        .//vision/Screenshot 2024-01-09 005549.png
        .//vision/Screenshot 2024-01-09 005609.png
        .//vision/Screenshot 2024-01-09 005714.png
        .//vision/Screenshot 2024-01-09 005853.png
     `;
            return data.split("\n")[index];
        }
        // Load and animate images
        const frameCount = 30;
        const images = [];
        const imageSeq = {
            frame: 1,
        };

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = files(i);
            images.push(img);
        }

        gsap.to(imageSeq, {
            frame: frameCount - 1,
            snap: "frame",
            ease: `none`,
            scrollTrigger: {
                scrub: 1, // Adjust the scrub value
                trigger: `#page31`,
                start: `15% top`,
                end: `45% top`,
                scroller: `#main`,
            },
            onUpdate: render,
        });

        images[1].onload = render;

        function render() {
            scaleImage(images[imageSeq.frame], context);
        }

        function scaleImage(img, ctx) {
            var canvas = ctx.canvas;
            var hRatio = canvas.width / img.width;
            var vRatio = canvas.height / img.height;
            var ratio = Math.min(hRatio, vRatio);
            var centerShift_x = (canvas.width - img.width * ratio) / 2;
            var centerShift_y = (canvas.height - img.height * ratio) / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                centerShift_x,
                centerShift_y,
                img.width * ratio,
                img.height * ratio
            );
        }

        // ScrollTrigger for canvas pinning
        ScrollTrigger.create({
            trigger: "#page31>canvas",
            scrub: 1, // Adjust the scrub value
            pin: true,
            scroller: `#main`,
            start: `15% top`,
            end: `40% top`,
        });
    }

    canvas2();


    var tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: `#page33`,
            start: `top top`,
            end: `15% top`,
            scrub: 1,
            scroller: `#main`,
            pin: true
        },
    })
    tl3.to("#page33>#trackingoff", {
        opacity: 0,
    })


    var tl4 = gsap.timeline({
        scrollTrigger: {
            trigger: `#page34`,
            start: `5% top`,
            end: `80% top`,
            scrub: 1,
            scroller: `#main`,
            pin: true
        },
    });
    tl4.to("#page34>#part2", { opacity: 1, }) // Reveal part2
        .to("#page34>#part3", { opacity: 1, }) // Reveal part3
        .to("#page34>#part4", { opacity: 1, }) // Reveal part4
        .to("#page34>#part5", { opacity: 1, }); // Reveal part5



    gsap.to("#page35>img", {
        opacity: 1,
        width: "95%",
        scrollTrigger: {
            trigger: `#page35`,
            start: `top top`,
            end: `20% top`,
            scrub: 1,
            scroller: `#main`,
            pin: true
        },
    });


    // var tl5 = gsap.timeline({
    //     scrollTrigger: {
    //         trigger: `#page35`,
    //         start: `10% top`,
    //         end: `30% top`,
    //         scrub: 1,
    //         scroller: `#main`,
    //         pin: true
    //     },
    // });

    // tl5.to("#page35>img", {
    //     opacity: `1`,
    // })

    // tl5.to("#page35>img", {
    //     width: "100%", // Initial width
    //     onUpdate: (self) => {
    //         // Increase width based on scroll position
    //         const newWidth = (self.progress * 100) + "%";
    //         gsap.set("#page35>img", { width: newWidth });
    //     },
    // })
}


// --------------------------------------------------- * For all screens * ---------------------------------------------------

function toggleMenu() {
    let svgContainer1 = document.querySelector('#menu>a>svg>#globalnav-menutrigger-bread-bottom');
    let svgContainer2 = document.querySelector('#menu>a>svg>#globalnav-menutrigger-bread-top');
    let navbar = document.querySelector('#containt');

    navbar.classList.toggle('active');
    svgContainer1.classList.toggle('rotate');
    svgContainer2.classList.toggle('rotate');
}

function toggleSVG2() {
    let svgContainer1 = document.querySelector('#submenu');
    let navbar = document.querySelector('#submbackg');
    let containt = document.querySelector('.ac-ln-menu-tray');
    let containt1 = document.querySelector('.ac-ln-menu-items');
    let menuItems = document.querySelectorAll('.ac-ln-menu-item');

    navbar.classList.toggle('active');
    svgContainer1.classList.toggle('rotate');
    containt.classList.toggle('active');
    containt1.classList.toggle('active');
    menuItems.forEach((menuItem, index) => {
        setTimeout(() => {
            menuItem.classList.toggle('active');
        }, index * 100); // Adjust the delay as needed
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var logoAnimation = document.querySelector('#page36 > .logoanimation');
    var options = {
        threshold: 1 // Trigger when 100% of the element is visible
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                logoAnimation.classList.add('animate');
                observer.disconnect(); // Stop observing once animation is triggered
            }
        });
    }, options);

    observer.observe(logoAnimation);
});
