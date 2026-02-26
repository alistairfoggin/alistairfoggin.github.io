/* ── Before/After Video Slider ────────────────── */
document.querySelectorAll('.ba-video-slider').forEach(slider => {
    const videoBefore = slider.querySelector('.ba-video-before');
    const videoAfter = slider.querySelector('.ba-video-after');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    function updatePosition(x) {
        const rect = slider.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        videoAfter.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', e => {
        isDragging = true;
        updatePosition(e.clientX);
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) updatePosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    let touchStartX, touchStartY, touchDecided;
    slider.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchDecided = false;
        isDragging = false;
    }, {passive: true});

    slider.addEventListener('touchmove', e => {
        if (!touchDecided) {
            const dx = Math.abs(e.touches[0].clientX - touchStartX);
            const dy = Math.abs(e.touches[0].clientY - touchStartY);
            if (dx > dy && dx > 5) {
                isDragging = true;
                touchDecided = true;
            } else if (dy > 5) {
                touchDecided = true;
                return;
            } else {
                return;
            }
        }
        if (isDragging) {
            e.preventDefault();
            updatePosition(e.touches[0].clientX);
        }
    }, {passive: false});

    slider.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Sync playback: keep both videos at the same time
    videoBefore.addEventListener('seeked', () => {
        if (Math.abs(videoAfter.currentTime - videoBefore.currentTime) > 0.05) {
            videoAfter.currentTime = videoBefore.currentTime;
        }
    });

    videoAfter.addEventListener('seeked', () => {
        if (Math.abs(videoBefore.currentTime - videoAfter.currentTime) > 0.05) {
            videoBefore.currentTime = videoAfter.currentTime;
        }
    });

    // Re-sync periodically to prevent drift
    videoBefore.addEventListener('timeupdate', () => {
        if (Math.abs(videoAfter.currentTime - videoBefore.currentTime) > 0.1) {
            videoAfter.currentTime = videoBefore.currentTime;
        }
    });

    // When one loops, sync the other
    videoBefore.addEventListener('play', () => {
        videoAfter.currentTime = videoBefore.currentTime;
        videoAfter.play();
    });

    videoAfter.addEventListener('play', () => {
        videoBefore.currentTime = videoAfter.currentTime;
        videoBefore.play();
    });

    // Play/pause button
    const playPauseBtn = slider.parentElement.querySelector('.ba-video-playpause');
    const playPauseIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (videoBefore.paused) {
                videoBefore.play();
                videoAfter.play();
            } else {
                videoBefore.pause();
                videoAfter.pause();
            }
        });

        videoBefore.addEventListener('pause', () => {
            playPauseIcon.className = 'fas fa-play';
        });

        videoBefore.addEventListener('playing', () => {
            playPauseIcon.className = 'fas fa-pause';
        });
    }

    // Timeline scrubber
    const scrubber = slider.parentElement.querySelector('.ba-video-scrubber');
    let isScrubbing = false;

    if (scrubber) {
        videoBefore.addEventListener('timeupdate', () => {
            if (!isScrubbing && videoBefore.duration) {
                scrubber.value = (videoBefore.currentTime / videoBefore.duration) * 1000;
            }
        });

        scrubber.addEventListener('mousedown', () => {
            isScrubbing = true;
        });
        scrubber.addEventListener('touchstart', () => {
            isScrubbing = true;
        }, {passive: true});

        scrubber.addEventListener('input', () => {
            const time = (scrubber.value / 1000) * videoBefore.duration;
            videoBefore.currentTime = time;
            videoAfter.currentTime = time;
        });

        function stopScrub() {
            isScrubbing = false;
        }

        scrubber.addEventListener('mouseup', stopScrub);
        scrubber.addEventListener('touchend', stopScrub);
    }
});

/* ── Before/After Slider ──────────────────────── */
document.querySelectorAll('.ba-slider').forEach(slider => {
    const afterImg = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    function updatePosition(x) {
        const rect = slider.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = pct + '%';
    }

    slider.addEventListener('mousedown', e => {
        isDragging = true;
        updatePosition(e.clientX);
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) updatePosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    let touchStartX, touchStartY, touchDecided;
    slider.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchDecided = false;
        isDragging = false;
    }, {passive: true});

    slider.addEventListener('touchmove', e => {
        if (!touchDecided) {
            const dx = Math.abs(e.touches[0].clientX - touchStartX);
            const dy = Math.abs(e.touches[0].clientY - touchStartY);
            if (dx > dy && dx > 5) {
                isDragging = true;
                touchDecided = true;
            } else if (dy > 5) {
                touchDecided = true;
                return;
            } else {
                return;
            }
        }
        if (isDragging) {
            e.preventDefault();
            updatePosition(e.touches[0].clientX);
        }
    }, {passive: false});

    slider.addEventListener('touchend', () => {
        isDragging = false;
    });
});

/* ── Clock Freeze-Intrinsics Slider ─────────── */
const clockFrames = [];
const clockBase = 'static/images/disentangle/freeze_intrinsics_clock_all/';
for (let i = 0; i <= 16; i++) {
    const num = String(i * 100).padStart(6, '0');
    const img = new Image();
    img.src = clockBase + 'frame_' + num + '.jpg';
    clockFrames.push(img);
}

const clockSlider = document.getElementById('clock-slider');
const clockDisplay = document.getElementById('clock-display');
let clockAutoplay = null;

function updateClock(frame) {
    clockDisplay.src = clockFrames[frame].src;
}

clockSlider.addEventListener('input', () => {
    if (clockAutoplay) {
        clearInterval(clockAutoplay);
        clockAutoplay = null;
    }
    updateClock(parseInt(clockSlider.value));
});

// Auto-play the clock slider
clockAutoplay = setInterval(() => {
    let v = (parseInt(clockSlider.value) + 1) % 17;
    clockSlider.value = v;
    updateClock(v);
}, 500);

/* ── Carousel Auto-play ──────────────────────── */
document.querySelectorAll('.carousel').forEach(carousel => {
    const imgs = carousel.querySelectorAll('.carousel-img');
    if (imgs.length === 0) return;
    let current = 0;

    setInterval(() => {
        imgs[current].classList.remove('active');
        current = (current + 1) % imgs.length;
        imgs[current].classList.add('active');
    }, 1500);
});


/* ── Copy BibTeX ─────────────────────────────── */
document.querySelectorAll('.copy-bibtex').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.closest('.bibtex-container').querySelector('code');
        navigator.clipboard.writeText(code.textContent).then(() => {
            const origText = btn.querySelector('span:last-child').textContent;
            btn.querySelector('span:last-child').textContent = 'Copied!';
            setTimeout(() => {
                btn.querySelector('span:last-child').textContent = origText;
            }, 2000);
        });
    });
});
