(() => {
  /**
   * Class Dropdown
   * @class
   */
  class Dropdown extends AxentixComponent {
    static getDefaultOptions() {
      return {
        animationDuration: 300,
        animationType: 'none',
        hover: false,
      };
    }

    /**
     * Construct Dropdown instance
     * @constructor
     * @param {String} element
     * @param {Object} options
     */
    constructor(element, options, isLoadedWithData) {
      super();

      Axentix.instances.push(this);

      this.el = document.querySelector(element);

      this.options = Axentix.getComponentOptions('Dropdown', options, this.el, isLoadedWithData);

      this._setup();
    }

    /**
     * Setup component
     */
    _setup() {
      Axentix.createEvent(this.el, 'dropdown.setup');
      this.dropdownContent = document.querySelector('#' + this.el.id + ' .dropdown-content');
      this.dropdownTrigger = document.querySelector('#' + this.el.id + ' .dropdown-trigger');
      this.isAnimated = false;
      this.isActive = this.el.classList.contains('active') ? true : false;

      if (this.options.hover) {
        this.el.classList.add('active-hover');
      } else {
        this._setupListeners();
      }

      this._setupAnimation();
    }

    /**
     * Setup listeners
     */
    _setupListeners() {
      if (this.options.hover) {
        return;
      }

      this.listenerRef = this._onClickTrigger.bind(this);
      this.dropdownTrigger.addEventListener('click', this.listenerRef);

      this.documentClickRef = this._onDocumentClick.bind(this);
      document.addEventListener('click', this.documentClickRef, true);
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
      if (this.options.hover) {
        return;
      }

      this.dropdownTrigger.removeEventListener('click', this.listenerRef);
      this.listenerRef = undefined;

      document.removeEventListener('click', this.documentClickRef, true);
      this.documentClickRef = undefined;
    }

    /**
     * Check and init animation
     */
    _setupAnimation() {
      const animationList = ['none', 'fade'];
      this.options.animationType = this.options.animationType.toLowerCase();
      animationList.includes(this.options.animationType) ? '' : (this.options.animationType = 'none');

      if (this.options.animationType !== 'none' && !this.options.hover) {
        if (this.options.hover) {
          this.el.style.animationDuration = this.options.animationDuration + 'ms';
        } else {
          this.el.style.transitionDuration = this.options.animationDuration + 'ms';
        }
        this.el.classList.add('anim-' + this.options.animationType);
      }
    }

    /**
     * Handle click on document click
     */
    _onDocumentClick(e) {
      if (e.target.matches('.dropdown-trigger')) {
        return;
      }

      if (this.isAnimated || !this.isActive) {
        return;
      }

      this.close();
    }

    /**
     * Handle click on trigger
     */
    _onClickTrigger(e) {
      e.preventDefault();
      if (this.isAnimated) {
        return;
      }

      this.isActive ? this.close() : this.open();
    }

    /**
     * Open dropdown
     */
    open() {
      if (this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'dropdown.open');
      this.dropdownContent.style.display = 'flex';
      setTimeout(() => {
        this.el.classList.add('active');
        this.isActive = true;
      }, 10);

      if (this.options.animationType !== 'none') {
        this.isAnimated = true;
        setTimeout(() => {
          this.isAnimated = false;
          Axentix.createEvent(this.el, 'dropdown.opened');
        }, this.options.animationDuration);
      } else {
        Axentix.createEvent(this.el, 'dropdown.opened');
      }
    }

    /**
     * Close dropdown
     */
    close() {
      if (!this.isActive) {
        return;
      }
      Axentix.createEvent(this.el, 'dropdown.close');
      this.el.classList.remove('active');

      if (this.options.animationType !== 'none') {
        this.isAnimated = true;
        setTimeout(() => {
          this.dropdownContent.style.display = '';
          this.isAnimated = false;
          this.isActive = false;
          Axentix.createEvent(this.el, 'dropdown.closed');
        }, this.options.animationDuration);
      } else {
        this.dropdownContent.style.display = '';
        this.isAnimated = false;
        this.isActive = false;
        Axentix.createEvent(this.el, 'dropdown.closed');
      }
    }
  }
  Axentix.Dropdown = Dropdown;
})();
