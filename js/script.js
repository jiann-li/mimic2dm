// Placeholder script for future interactive elements
document.addEventListener('DOMContentLoaded', () => {
    console.log("Project page loaded.");

    const videoSrc = document.getElementById('video-src');
    const videoRef = document.getElementById('video-ref');
    const videoSim = document.getElementById('video-sim');

    if (videoSrc && videoRef && videoSim) {
        const resetVideo = (video) => {
            video.pause();
            video.currentTime = 0;
            video.classList.add('opacity-0');
        };

        const playVideo = (video) => {
            video.play();
            video.classList.remove('opacity-0');
        };

        const startSequence = () => {
            // T=0s: Play Src, others reset
            resetVideo(videoSrc);
            playVideo(videoSrc);
            
            resetVideo(videoRef);
            resetVideo(videoSim);

            // T=4s: Play Ref
            setTimeout(() => {
                playVideo(videoRef);
            }, 4000);

            // T=10s: Play Sim
            setTimeout(() => {
                playVideo(videoSim);
            }, 10000);
        };

        // Start immediately
        startSequence();

        // Repeat every 15s
        setInterval(startSequence, 15000);
    }

    // --- Comparison Gallery Logic ---
    const comparisonData = [
        {
            ref: 'assets/baseline_1_ref.mp4',
            baseline: { type: 'video', content: 'assets/baseline_1_sfv.mp4' },
            ours: { type: 'video', content: 'assets/baseline_1_ours.mp4' },
            caption: 'Baseline methods are unable to complete turning motions due to inaccurate estimation of the ball\'s depth.'
        },
        {
            ref: 'assets/baseline_2_ref.mp4',
            baseline: { type: 'video', content: 'assets/baseline_2_sfv.mp4' },
            ours: { type: 'video', content: 'assets/baseline_2_ours.mp4' },
            caption: 'The imperfect 3D reconstruction in baseline methods limits their ability to capture precise dribbling styles.'
        },
        {
            ref: 'assets/baseline_3_ref.mp4',
            baseline: { type: 'video', content: 'assets/baseline_3_sfv.mp4' },
            ours: { type: 'video', content: 'assets/baseline_3_ours.mp4' },
            caption: 'Our method generalizes robustly to non-human topologies, while baseline approaches struggle with limb coordination due to the absence of tailored priors.'
        }
    ];

    let currentCompIndex = 0;
    const compVideoRef = document.getElementById('comp-video-ref');
    const compBaselineContainer = document.getElementById('comp-baseline-container');
    const compOursContainer = document.getElementById('comp-ours-container');
    const compCaption = document.getElementById('comp-caption');
    const prevBtn = document.getElementById('prev-comparison');
    const nextBtn = document.getElementById('next-comparison');
    const dotsContainer = document.getElementById('comp-dots');

    if (compVideoRef && compBaselineContainer && compOursContainer && prevBtn && nextBtn) {
        
        // Create Dots
        comparisonData.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full transition-colors ${idx === 0 ? 'bg-blue-600' : 'bg-gray-300'}`;
            dot.onclick = () => goToComparison(idx);
            dotsContainer.appendChild(dot);
        });

        const updateContent = (container, data) => {
            container.innerHTML = '';
            if (data.type === 'video') {
                const video = document.createElement('video');
                video.src = data.content;
                video.muted = true;
                video.loop = false; // Disable loop for sync
                video.autoplay = true;
                video.playsInline = true;
                video.className = 'w-full h-full object-cover absolute inset-0';
                container.appendChild(video);
            } else if (data.type === 'image') {
                const img = document.createElement('img');
                img.src = data.content;
                img.className = 'w-full h-full object-cover absolute inset-0';
                container.appendChild(img);
            } else {
                const span = document.createElement('span');
                span.textContent = data.content;
                span.className = 'text-center px-4';
                container.appendChild(span);
            }
        };

        const goToComparison = (index) => {
            currentCompIndex = index;
            const data = comparisonData[currentCompIndex];

            // Update Reference Video
            compVideoRef.src = data.ref;
            
            // Update Baseline
            updateContent(compBaselineContainer, data.baseline);

            // Update Ours
            updateContent(compOursContainer, data.ours);

            // Update Caption
            compCaption.innerHTML = data.caption;

            // Update Dots
            Array.from(dotsContainer.children).forEach((dot, idx) => {
                dot.className = `w-2 h-2 rounded-full transition-colors ${idx === currentCompIndex ? 'bg-blue-600' : 'bg-gray-300'}`;
            });

            // Synchronize Videos
            const videos = [compVideoRef];
            const baselineVideo = compBaselineContainer.querySelector('video');
            if (baselineVideo) videos.push(baselineVideo);
            const oursVideo = compOursContainer.querySelector('video');
            if (oursVideo) videos.push(oursVideo);

            let endedCount = 0;
            const onVideoEnded = () => {
                endedCount++;
                if (endedCount === videos.length) {
                    // All videos ended, replay all
                    videos.forEach(v => {
                        v.currentTime = 0;
                        v.play().catch(e => console.log("Replay prevented", e));
                    });
                    endedCount = 0;
                }
            };

            videos.forEach(v => {
                v.loop = false;
                v.muted = true;
                v.onended = onVideoEnded;
                // Reset time and play
                v.currentTime = 0;
                v.play().catch(e => console.log("Autoplay prevented", e));
            });
        };

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentCompIndex - 1 + comparisonData.length) % comparisonData.length;
            goToComparison(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentCompIndex + 1) % comparisonData.length;
            goToComparison(newIndex);
        });

        // Initialize with first comparison
        goToComparison(0);
    }

    // --- More Results Gallery Logic ---
    const moreResultsData = [
        {
            video: 'assets/gen_results_1.mp4',
        },
        {
            video: 'assets/gen_results_2.mp4',
        },
        {
            video: 'assets/gen_results_3.mp4',
        },
    ];

    const moreTrack = document.getElementById('more-track');

    if (moreTrack) {
        // Render items
        moreResultsData.forEach(data => {
            const item = document.createElement('div');
            item.className = 'w-full flex flex-col'; 
            item.innerHTML = `
                <div class="bg-gray-100 rounded-lg overflow-hidden aspect-video mb-2 relative shadow-sm border border-gray-200">
                    <video muted playsinline autoplay loop class="w-full h-full object-cover">
                        <source src="${data.video}" type="video/mp4">
                    </video>
                </div>
            `;
            moreTrack.appendChild(item);
        });
    }
});