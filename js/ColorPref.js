class ColorPref {
	#localStorageKey
	#colorMode
	#userPreference
	#storedColorMode
	#defaultColorMode
	#availableSchemes
	#attributeFlags
	#eventListeners
	#verbose

	constructor({
		defaultColorMode = 'light',
		availableSchemes = ['light', 'dark'],
		attributeFlags = [
			{
				selector: 'html',
				attribute: 'data-bs-theme',
				value: () => this.colorMode,
			},
			{
				selector: 'input[type="checkbox"][name="dark-mode"]',
				attribute: 'checked',
				value: () => Boolean(this.colorMode === 'dark'),
			},
		],
		eventListeners = [
			{
				collection: [
					() =>
						document.querySelector('input[type="checkbox"][name="dark-mode"]'),
				],
				event: 'change',
				handler: () => {
					const newMode = document.querySelector(
						'input[type="checkbox"][name="dark-mode"]',
					).checked
						? 'dark'
						: 'light'
					this.#updateColorMode(newMode, true)
				},
			},
			{
				collection: [
					() =>
						this.#availableSchemes.map(s =>
							window.matchMedia(`(prefers-color-scheme: ${s})`),
						),
				],
				event: 'change',
				handler: () => {
					if (!this.#getStoredColorMode()) {
						const newMode = this.#checkUserPreference()
						if (newMode && newMode !== this.#colorMode) {
							this.#updateColorMode(newMode)
						}
					}
				},
			},
		],
		localStorageKey = 'vs-color-mode',
		verbose = false,
	} = {}) {
		this.#localStorageKey = localStorageKey
		this.#availableSchemes = availableSchemes
		this.#storedColorMode = this.#getStoredColorMode()
		this.#userPreference = this.#checkUserPreference()
		this.#defaultColorMode = defaultColorMode
		this.#attributeFlags = attributeFlags
		this.#eventListeners = eventListeners
		this.#verbose = verbose
		this.#init()
	}

	#init() {
		let colorMode = this.#defaultColorMode
		if (
			document.querySelector('input[type="checkbox"][name="dark-mode"]').checked
		) {
			if (this.#verbose) {
				console.log('Using checkbox state for color mode: dark')
			}
			colorMode = 'dark'
		} else if (this.#storedColorMode) {
			if (this.#verbose) {
				console.log('Using stored color mode:', this.#storedColorMode)
			}
			colorMode = this.#storedColorMode
		} else if (this.#userPreference) {
			if (this.#verbose) {
				console.log('Using user preferred color mode:', this.#storedColorMode)
			}
			colorMode = this.#userPreference
		}
		this.#updateColorMode(colorMode)
	}

	#updateColorMode(mode, store = false) {
		if (this.#verbose) {
			console.log('Updating color mode to:', mode)
		}
		if (this.#availableSchemes.includes(mode)) {
			this.#colorMode = mode
			if (store) {
				if (this.#verbose) {
					console.log('Storing color mode:', mode)
				}
				this.#storeColorMode()
			}
			this.#setAttributeFlags()
			this.#addEventListeners()
		} else {
			throw new Error(`Color mode "${mode}" is not available.`)
		}
	}

	#addEventListeners() {
		if (this.#verbose) {
			console.log('Adding event listeners for color mode:', this.#colorMode)
		}
		for (const listener of this.#eventListeners) {
			const elements = listener.collection.map(c => c()).flat()
			for (const element of elements) {
				if (this.#verbose) {
					console.log(
						`Adding event listener for ${listener.event} on element:`,
						element,
					)
				}
				element.addEventListener(listener.event, listener.handler)
			}
		}
	}

	#setAttributeFlags() {
		if (this.#verbose) {
			console.log('Setting attribute flags for color mode:', this.#colorMode)
		}
		for (const flag of this.#attributeFlags) {
			const elements = document.querySelectorAll(flag.selector)
			for (const element of elements) {
				if (this.#verbose) {
					console.log(
						`Setting attribute "${flag.attribute}" on element:`,
						element,
					)
				}
				if (flag.attribute === 'checked') {
					const testVal =
						typeof flag.value === 'function' ? flag.value() : flag.value
					if (testVal === false) {
						element.removeAttribute(flag.attribute)
					} else {
						element.setAttribute(flag.attribute, 'true')
					}
				} else {
					element.setAttribute(
						flag.attribute,
						typeof flag.value === 'function' ? flag.value() : flag.value,
					)
				}
			}
		}
	}

	#checkUserPreference() {
		for (const scheme of this.#availableSchemes) {
			if (window.matchMedia(`(prefers-color-scheme: ${scheme})`).matches) {
				return scheme
			}
		}
		return undefined
	}

	#getStoredColorMode() {
		return localStorage.getItem(this.#localStorageKey)
	}

	#storeColorMode() {
		localStorage.setItem(this.#localStorageKey, this.#colorMode)
	}

	get colorMode() {
		return this.#colorMode
	}
}

export default ColorPref
